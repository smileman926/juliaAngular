import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';

import {
  CompanyInfoListModel,
  CompanyInfoModel,
} from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import {
  LocalInfoModel,
  SaraEmailTemplatesModel,
  SaraSettingsModel } from '../model';

@Component({
  selector: 'app-booking-tools-sara',
  templateUrl: './booking-tools-sara.component.pug',
  styleUrls: ['./booking-tools-sara.component.sass']
})
export class BookingToolsSaraComponent implements OnInit {

  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public localeID: string;
  public saraSettings: SaraSettingsModel;
  public saraEmailTemplates: SaraEmailTemplatesModel[];
  public localeInfoList: LocalInfoModel[];
  public currentTemplate: string;
  public prevLink: string;
  public goToOnlineLink: string;
  public isLoading: Observable<boolean>;
  public isDisablePassGen: boolean;
  public isCheckGenPeriod: boolean;
  public isPassChangeSuccess: boolean;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private mainService: MainService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isDisablePassGen = false;
    this.isCheckGenPeriod = false;
    this.isPassChangeSuccess = false;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3, val4] = await Promise.all([
      this.apiHotel.getCompanyBookingModel().toPromise(),
      this.apiHotel.getSaraEmailTemplatesModel().toPromise(),
      this.apiHotel.getLocaleInfoModel().toPromise(),
      this.apiHotel.getSaraSettingsModel().toPromise()
    ]);
    this.itemsList = val1;
    this.items = this.itemsList['0'];
    // this.localeID = this.items.c_feLocale_id;
    this.localeID = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.saraEmailTemplates = val2;
    this.localeInfoList = val3.filter( item => item.l_id !== '7' && item.l_active === 'on');
    this.saraSettings = val4;
    this.currentTemplate = this.saraEmailTemplates.filter( item => item.scevl_locale_id === this.localeID)[0].scevl_text;

    this.form = new FormGroup({
      ss_showAtThankyouPage: new FormControl(this.saraSettings.ss_showAtThankyouPage === 'on'),
      ss_showAtOnlineCheckin: new FormControl(this.saraSettings.ss_showAtOnlineCheckin === 'on'),
      ss_newDesignReservation: new FormControl(this.saraSettings.ss_newDesignReservation === 'on'),
      ss_useCustomEmailVariable: new FormControl(this.saraSettings.ss_useCustomEmailVariable === 'on'),
      c_currentTemplate: new FormControl(this.currentTemplate),
      c_currentLocale: new FormControl(this.localeID),
      ss_firebaseEmail: new FormControl(this.saraSettings.ss_firebaseEmail, [Validators.required, Validators.email])
    });

    if (this.saraSettings.ss_useCustomEmailVariable === 'off') {
      (this.form.get('c_currentTemplate') as FormControl).disable();
    }

    const waitUntil = new Date(new Date(this.saraSettings.ss_firebasePasswordChanged).getTime() + 60 * 60 * 24 * 1000);
    const now = new Date();
    if (now < waitUntil) {
      this.isCheckGenPeriod = true;
    }
    this.onChanges();

  }

  onChanges(): void {
    (this.form.get('ss_firebaseEmail') as FormControl).valueChanges.subscribe(val => {
      this.isDisablePassGen = val !== this.saraSettings.ss_firebaseEmail ? true : false;
    });
    (this.form.get('ss_useCustomEmailVariable') as FormControl).valueChanges.subscribe(val => {
      const field = this.form.get('c_currentTemplate') as FormControl;
      val ? field.enable() : field.disable();
    });
    (this.form.get('c_currentTemplate') as FormControl).valueChanges.subscribe(val => {
      const { c_currentLocale } = this.form.getRawValue();
      (this.saraEmailTemplates.find( item => item.scevl_locale_id === c_currentLocale) as SaraEmailTemplatesModel).scevl_text = val;
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();

    const mainOptions = {
      ss_chatSetupHintIgnore: this.saraSettings.ss_chatSetupHintIgnore,
      ss_firebaseEmail: formVals.ss_firebaseEmail,
      ss_firebasePasswordChanged: this.saraSettings.ss_firebasePasswordChanged,
      ss_hideCalltoActionModal: this.saraSettings.ss_hideCalltoActionModal,
      ss_id: this.saraSettings.ss_id,
      ss_newDesignReservation: formVals.ss_newDesignReservation ? 1 : 0,
      ss_showAtOnlineCheckin: formVals.ss_showAtOnlineCheckin ? 1 : 0,
      ss_showAtThankyouPage: formVals.ss_showAtThankyouPage ? 1 : 0,
      ss_useCustomEmailVariable: formVals.ss_useCustomEmailVariable ? 1 : 0
    };

    await Promise.all([
      this.apiHotel
        .postSaraSettingsModel(mainOptions)
        .toPromise(),
      this.apiHotel
        .postSaraEmailTemplateModel({
          locales: this.saraEmailTemplates
        })
        .toPromise()
    ]);
  }

  @Loading(LoaderType.LOAD)
  public async generatePassword(): Promise<void> {
    const result = await this.apiHotel.postGeneratePassword().toPromise();
    if (result.success) {
      this.isPassChangeSuccess = true;
    }

  }

  search(): void {
    const { c_currentLocale } = this.form.getRawValue();
    const field = this.form.get('c_currentTemplate') as FormControl;
    const value = (this.saraEmailTemplates.find( item => item.scevl_locale_id === c_currentLocale) as SaraEmailTemplatesModel).scevl_text;
    field.setValue(value);
  }

  ngOnInit(): void {
    this.init();
  }

}
