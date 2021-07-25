import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { UpdateCateringListInLinkTaxesEvent } from '@/app/main/window/content/billing/billing-settings/billing-settings-link-taxes/events';
import { ModalService } from '@/ui-kit/services/modal.service';

import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import {
  Catering, CateringDetails, CateringSettingsFormBody, CATERINGTYPE, CompanyCateringConfig, RawCateringDetails, SaveCateringResponse
} from '@/app/main/window/content/pricing-admin/catering-settings/models';
import { EventBusService } from '@/app/main/window/shared/event-bus';

import { CompanyDetails } from '@/app/main/models';
import { LoaderType } from '@/app/main/window/content/pricing-admin/catering-settings/loader-type';

import { ApiCateringSettingsService } from '@/app/helpers/api/api-catering-settings.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { RefreshCateringSettings } from '@/app/main/window/content/pricing-admin/catering-settings/events';

@Component({
  selector: 'app-catering-settings',
  templateUrl: './catering-settings.component.pug',
  styleUrls: ['./catering-settings.component.sass']
})
export class CateringSettingsComponent implements OnInit, OnDestroy, OnChanges {
  public isLoading: Observable<boolean>;
  public isContentLoading: Observable<boolean>;

  public caterings: Catering[];
  public form: FormGroup;
  public selectedCatering: Catering;
  public cateringDetails: CateringDetails;
  public languages: { l_id: string; l_name: string, l_nameDisplay: string, l_desc: string }[];

  private config: CompanyCateringConfig;
  private companyDetails: CompanyDetails;

  constructor(
    private apiCateringSettingsService: ApiCateringSettingsService,
    private loaderService: LoaderService,
    private cacheService: CacheService,
    private eventBusService: EventBusService,
    private mainService: MainService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INIT);
    this.isContentLoading = this.loaderService.isLoading(LoaderType.CONTENT);
  }

  public selectCatering(catering: Catering) {
    this.selectedCatering = catering;
    this.loadCateringDetails().catch();
  }

  @Loading(LoaderType.CONTENT)
  private async loadCateringDetails() {
    if (!this.selectedCatering) {
      return;
    }
    this.cateringDetails = await this.apiCateringSettingsService.getCateringDetails(this.selectedCatering.id).toPromise();
    this.updateForm();
  }

  private getCateringLocaleName(localeId?: number): string | null {
    let cateringLocaleName: string | null = null;
    if (this.cateringDetails && this.cateringDetails.serviceTypeLocale) {
      let myLocaleId: number | null = null;
      if (localeId) {
        myLocaleId = localeId;
      } else if (this.form) {
        myLocaleId = (this.form.get('language') as FormControl).value;
      }
      if (myLocaleId ) {
        const temp = this.cateringDetails.serviceTypeLocale.find((c) => myLocaleId && +c.localeId === +myLocaleId);
        if (temp) {
          cateringLocaleName = temp.name;
        } else {
          cateringLocaleName = '';
          this.cateringDetails.serviceTypeLocale.push(
            { id: null, serviceTypeId: this.cateringDetails.id, localeId: myLocaleId, name: cateringLocaleName }
          );
        }
      }
    }
    return cateringLocaleName;
  }

  private updateForm() {
    if (this.cateringDetails) {
      (this.form.get('active') as FormControl).setValue(this.cateringDetails.active);
      (this.form.get('name') as FormControl).setValue(this.getCateringLocaleName(+this.companyDetails.c_beLocale_id));
      (this.form.get('language') as FormControl).setValue(this.companyDetails.c_beLocale_id);
      (this.form.get('breakfast') as FormControl).setValue(!!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.BREAKFAST));
      (this.form.get('lunch') as FormControl).setValue(!!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.LUNCH));
      (this.form.get('afternoon') as FormControl).setValue(!!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.AFTERNOON));
      (this.form.get('dinner') as FormControl).setValue(!!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.DINNER));
      (this.form.get('allIncl') as FormControl).setValue(!!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.ALLINCL));
    }
  }

  private updateServiceTypeLocale() {
    const newName = (this.form.get('name') as FormControl).value;
    const currentLanguage = (this.form.get('language') as FormControl).value;
    const serviceTypeLocaleObj = this.cateringDetails.serviceTypeLocale.find((s) => +s.localeId === +currentLanguage);
    if (serviceTypeLocaleObj) {
      serviceTypeLocaleObj.name = newName;
    }
    setTimeout(() => {
      (this.form.get('name') as FormControl).updateValueAndValidity();
    });
  }

  private customCateringNameValidator(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      if (!this.cateringDetails) {
        return null;
      }
      let invalid = false;
      const toBeValidated: CateringDetails['serviceTypeLocale'][0][] = [];
      this.languages.forEach((lang) => {
        const temp = this.cateringDetails.serviceTypeLocale.find((stl) => +stl.localeId === +lang.l_id);
        if (temp) {
          toBeValidated.push(temp);
        }
      });
      toBeValidated.forEach((s) => {
        if (!s.name || s.name.length < 1) {
          invalid = true;
        }
      });
      return invalid ? { invalid } : null;
    };
  }

  private loadForm() {
    if (!this.config || !this.languages || !this.caterings) {
      return;
    }
    this.form = new FormGroup({
      methodDefaultCatering: new FormControl(this.config.methodDefaultCatering),
      methodOtherCatering: new FormControl(this.config.methodOtherCatering),
      active: new FormControl(this.cateringDetails ? this.cateringDetails.active : null),
      name: new FormControl(
        this.cateringDetails ? this.getCateringLocaleName(+this.companyDetails.c_beLocale_id) : null,
        [this.customCateringNameValidator()]
      ),
      language: new FormControl(this.companyDetails.c_beLocale_id),
      breakfast: new FormControl(
        this.cateringDetails ? !!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.BREAKFAST) : null
      ),
      lunch: new FormControl(
        this.cateringDetails ? !!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.LUNCH) : null
      ),
      afternoon: new FormControl(
        this.cateringDetails ? !!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.AFTERNOON) : null
      ),
      dinner: new FormControl(
        this.cateringDetails ? !!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.DINNER) : null
      ),
      allIncl: new FormControl(
        this.cateringDetails ? !!this.cateringDetails.catering.find((c) => c.id === CATERINGTYPE.ALLINCL) : null
      )
    });

    (this.form.get('name') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateServiceTypeLocale();
    });

    (this.form.get('language') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      (this.form.get('name') as FormControl).setValue(this.getCateringLocaleName());
    });

  }

  private reloadCompanyDetails() {
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
    this.mainService.updateCompanyDetails(true).catch();
  }

  private reloadActiveServiceTypes() {
    this.eventBusService.emit('reloadActiveServiceTypes');
  }

  private prepareCateringBody(body: CateringSettingsFormBody): { cst_catering_id: string, cst_serviceType_id: string }[] {
    const catering: { cst_catering_id: string, cst_serviceType_id: string }[] = [];
    if (body.breakfast) {
      catering.push({cst_catering_id: (CATERINGTYPE.BREAKFAST).toString(), cst_serviceType_id: this.cateringDetails.id.toString()});
    }
    if (body.lunch) {
      catering.push({cst_catering_id: (CATERINGTYPE.LUNCH).toString(), cst_serviceType_id: this.cateringDetails.id.toString()});
    }
    if (body.afternoon) {
      catering.push({cst_catering_id: (CATERINGTYPE.AFTERNOON).toString(), cst_serviceType_id: this.cateringDetails.id.toString()});
    }
    if (body.dinner) {
      catering.push({cst_catering_id: (CATERINGTYPE.DINNER).toString(), cst_serviceType_id: this.cateringDetails.id.toString()});
    }
    if (body.allIncl) {
      catering.push({cst_catering_id: (CATERINGTYPE.ALLINCL).toString(), cst_serviceType_id: this.cateringDetails.id.toString()});
    }
    return catering;
  }

  @Loading(LoaderType.INIT)
  private async fetchData(getCompanyDetailsForced?: boolean) {
    if (this.selectedCatering) {
      [this.config, this.companyDetails, this.caterings, this.cateringDetails] = await Promise.all(
        [
          this.apiCateringSettingsService.getCompanyCateringConfig().toPromise(),
          this.cacheService.getCompanyDetails(!!getCompanyDetailsForced),
          this.apiCateringSettingsService.getCaterings().toPromise(),
          this.apiCateringSettingsService.getCateringDetails(this.selectedCatering.id).toPromise()
        ]
      );
    } else {
      [this.config, this.companyDetails, this.caterings] = await Promise.all(
        [
          this.apiCateringSettingsService.getCompanyCateringConfig().toPromise(),
          this.cacheService.getCompanyDetails(!!getCompanyDetailsForced),
          this.apiCateringSettingsService.getCaterings().toPromise()
        ]
      );
    }
    this.eventBusService.emit<UpdateCateringListInLinkTaxesEvent>('updateCateringList');
    this.languages = this.companyDetails.languagesDataProvider;
    this.loadForm();
  }

  @Loading(LoaderType.INIT)
  async save() {
    const body: CateringSettingsFormBody = this.form.getRawValue();
    const configResponse = await this.apiCateringSettingsService.putCompanyCateringConfig({
      c_id: this.config.id.toString(),
      c_methodDefaultCatering: body.methodDefaultCatering,
      c_methodOtherCatering: body.methodOtherCatering
    }, this.config.id).toPromise();
    if (configResponse.updatedCount && configResponse.updatedCount > 0) {
      this.reloadCompanyDetails();
    }
    if (this.selectedCatering && this.cateringDetails) {
      const cateringDetailsResponse: SaveCateringResponse = await this.apiCateringSettingsService.putCateringDetails({
        catering: this.prepareCateringBody(body),
        serviceTypeLocale: this.cateringDetails.serviceTypeLocale.map((l: CateringDetails['serviceTypeLocale'][0]) => ({
          stl_id: l.id ? l.id.toString() : null,
          stl_serviceType_id: l.serviceTypeId.toString(),
          stl_locale_id: l.localeId.toString(),
          stl_name: l.name
        } as RawCateringDetails['serviceTypeLocale'][0])),
        st_active: body.active ? 'on' : 'off',
        st_id: this.cateringDetails.id.toString(),
        st_name: this.cateringDetails.name,
        st_price: this.cateringDetails.price.toString(),
        st_sortOrder: this.cateringDetails.sortOrder.toString()
      }, this.cateringDetails.id).toPromise();

      if (cateringDetailsResponse && (
        (cateringDetailsResponse.stActiveChanged && cateringDetailsResponse.stActiveChanged === 1) ||
        (cateringDetailsResponse.stlUpdated && cateringDetailsResponse.stlUpdated > 0))) {
        this.reloadActiveServiceTypes();
      }
      if (cateringDetailsResponse && cateringDetailsResponse.stActiveError && cateringDetailsResponse.stActiveError === 'on') {
        const classes: string[] = ['error'];
        this.modalService.openSimpleText('ebc.cateringSettings.error_setAsDefaultInSeasonPeriod.text', undefined, {
          classes
        });
      }
    }
    this.fetchData().catch();
  }

  ngOnInit() {
    this.fetchData().catch();

    this.eventBusService.on<RefreshCateringSettings>('refreshCateringSettings').pipe(untilDestroyed(this)).subscribe(() => {
      this.fetchData(true).catch();
    });
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue && !top.currentValue) {
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    }
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
  }
}
