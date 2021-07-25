import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { LanguageService } from '@/app/i18n/language.service';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';


import {
  CancellationLocaleModel,
  CompanyInfoListModel,
  CompanyInfoModel,
  TermsAndConditionsModel
} from '@/app/main/window/content/my-company/operation-settings/models';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';

import { LocalInfoModel } from '../../../web-tools/booking-tools/model';
import { LoaderType } from '../loader-types';
import { ChangeCancellationComponent } from './change-cancellation-text/change-cancellation-text.component';

@Component({
  selector: 'app-operation-cancellation-terms-condition',
  templateUrl: './operation-cancellation-terms-condition.component.pug',
  styleUrls: ['./operation-cancellation-terms-condition.component.sass']
})
export class OperationCancellationTermsConditionComponent implements OnInit {

  form: FormGroup;
  cancelationText: string;
  public localeInfoList: LocalInfoModel[] = [];
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public termsConditionsItems: TermsAndConditionsModel[];
  public localetranslations: CancellationLocaleModel[];
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private modalService: ModalService,
    private languageService: LanguageService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INNER_TAB_CANCELLATION);
    this.cancelationText = '';
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      c_cancellationEnabled: formVals.c_cancellationEnabled ? 'on' : 'off',
    };
    await Promise.all([
      this.apiHotel
        .putCompanyModel(body)
        .toPromise(),
      this.localeInfoList.map( async (item, index) => {
        const changeID = this.termsConditionsItems.filter( l => l.tcl_locale_id === item.l_id)[0].tcl_id;
        const changeUrl = this.termsConditionsItems.filter( l => l.tcl_locale_id === item.l_id)[0].tcl_url;
        if ( changeUrl !== formVals.localeLinks[index]) {
          await this.apiHotel.putTermsAndConditionsModel(changeID, {
            tcl_id: changeID,
            tcl_url: formVals.localeLinks[index]
          }).toPromise();
        }
      })
    ]);
    this.init();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3, val4] = await Promise.all([
      this.apiHotel.getCompanyModel().toPromise(),
      this.apiHotel.getTermsAndConditionsModel().toPromise(),
      this.apiHotel.getCancellationLocaleModel().toPromise(),
      this.apiHotel.getLocaleInfoModel().toPromise()
    ]);
    this.itemsList = val1;
    this.items = this.itemsList['0'];
    this.termsConditionsItems = val2.filter( item => item.tcl_id !== '7' && item.tcl_id !== '8' && item.tcl_id !== '9');
    this.localetranslations = val3;
    this.cancelationText = this.localetranslations.filter(item => item.cl_locale_id === this.items.c_beLocale_id)[0].cl_value;
    this.localeInfoList = val4.filter( item => item.l_id !== '7' && item.l_active === 'on');

    this.form = new FormGroup({
      c_cancellationEnabled: new FormControl(this.items.c_cancellationEnabled === 'on'),
      localeLinks: new FormArray(this.localeInfoList.map(item => {
        return new FormControl(
          this.termsConditionsItems.find(l => l.tcl_locale_id === item.l_id) ?
          this.termsConditionsItems.filter(l => l.tcl_locale_id === item.l_id)[0].tcl_url : ''
        );
      })),
    });
  }

  public async changeTranslate() {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', ChangeCancellationComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      this.cancelationText = result.initVal;
      modal.close(!!result.res);
    });
  }

  openReference(): void {
    redirectWithPOST(
      getUrl('/wo/Services/com/gotoacademy.php'),
      {
        screen: 'termsAndConditions',
        l_id: String(this.languageService.getLanguageId())
      }
    );
  }

  ngOnInit() {
    this.init();
  }

}
