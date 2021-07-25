import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';
import {
  CompanyInfoListModel,
  CompanyInfoModel,
} from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { LoaderType } from '../loader-types';
import { CodeQueryModel, LocalInfoModel, MandatoryFieldsModel } from '../model';


@Component({
  selector: 'app-booking-tools-settings',
  templateUrl: './booking-tools-settings.component.pug',
  styleUrls: ['./booking-tools-settings.component.sass']
})
export class BookingToolsSettingsComponent implements OnInit {

  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public localeID: string;
  public localeCodeQueryList: CodeQueryModel[];
  public localeInfoList: LocalInfoModel[];
  public mandatoryFields: MandatoryFieldsModel[];
  public isShowCodeQuery: boolean;
  public currentCodeQuery: string;
  public prevLink: string;
  public goToOnlineLink: string;
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private mainService: MainService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.localeID = this.mainService.getCompanyDetails().c_beLocale_id.toString();
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();

    const mainOptions = {
      c_analyticsTrackingCode: formVals.c_analyticsTrackingCode,
      c_showRoomsInFrontend: formVals.c_showRoomsInFrontend ? 'on' : 'off',
      c_feShowRoomNumbers: formVals.c_feShowRoomNumbers ? 'on' : 'off',
      c_feNewsletterEnabled: formVals.c_feNewsletterEnabled ? 'on' : 'off',
      c_timeGapTilArrival: formVals.c_timeGapTilArrival,
      c_feMaxNoOfRooms: formVals.c_feMaxNoOfRooms,
      c_notifyAtXNoOfRooms: formVals.c_notifyAtXNoOfRooms
    };

    await Promise.all([
      this.apiHotel
        .putCompanyBookingModel(mainOptions)
        .toPromise(),
      this.apiHotel
        .putLocaleCodeQueryModel({
          locales: this.localeCodeQueryList
        })
        .toPromise(),
      this.mandatoryFields.map( async item =>
          await this.apiHotel.putBookingRequiredFieldsModel(
            item.mf_id,
            {
              mf_display: formVals.c_isShowCodeQuery ? 'on' : 'off',
              mf_id: item.mf_id,
              mf_mandatory: formVals.c_isShowCodeQuery ? 'on' : 'off'
            }
          ).toPromise()
      )
    ]);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3, val4] = await Promise.all([
      this.apiHotel.getCompanyBookingModel().toPromise(),
      this.apiHotel.getLocaleCodeQueryModel().toPromise(),
      this.apiHotel.getMandatoryFieldsModel().toPromise(),
      this.apiHotel.getLocaleInfoModel().toPromise()
    ]);
    this.itemsList = val1;
    this.items = this.itemsList['0'];
    this.localeCodeQueryList = val2[0].locales.filter( item => item.cfl_locale_id !== '7');
    this.mandatoryFields = val3.filter( item => item.mf_fieldName === 'b_actionCode');
    this.isShowCodeQuery = this.mandatoryFields[0].mf_display === 'on' && this.mandatoryFields[1].mf_display === 'on';
    this.localeInfoList = val4.filter( item => item.l_id !== '7' && item.l_active === 'on');
    this.currentCodeQuery = this.localeCodeQueryList.filter( item => item.cfl_locale_id === this.localeID)[0].cfl_value;
    this.prevLink = this.items.c_previewLink;
    this.goToOnlineLink = environment.remoteUrl + `bookingengine2/#/${this.apiHotel.getCIdAndLId()}`;

    this.form = new FormGroup({
      c_showRoomsInFrontend: new FormControl(this.items.c_showRoomsInFrontend === 'on'),
      c_feShowRoomNumbers: new FormControl(this.items.c_feShowRoomNumbers === 'on'),
      c_feNewsletterEnabled: new FormControl(this.items.c_feNewsletterEnabled === 'on'),
      c_timeGapTilArrival: new FormControl(Number(this.items.c_timeGapTilArrival)),
      c_feMaxNoOfRooms: new FormControl(Number(this.items.c_feMaxNoOfRooms)),
      c_notifyAtXNoOfRooms: new FormControl(Number(this.items.c_notifyAtXNoOfRooms)),
      c_analyticsTrackingCode: new FormControl(this.items.c_analyticsTrackingCode),
      c_isShowCodeQuery: new FormControl(this.isShowCodeQuery),
      c_currentCodeQuery: new FormControl(this.currentCodeQuery, Validators.required),
      c_currentLocale: new FormControl(this.localeID),
      c_prevLink: new FormControl(this.prevLink)
    });

    this.onChanges();
  }

  onChanges(): void {
    (this.form.get('c_currentCodeQuery') as FormControl).valueChanges.subscribe(val => {
      const { c_currentLocale } = this.form.getRawValue();
      (this.localeCodeQueryList.find( item => item.cfl_locale_id === c_currentLocale) as CodeQueryModel).cfl_value = val;
    });
  }

  search(): void {
    const { c_currentLocale } = this.form.getRawValue();
    const field = this.form.get('c_currentCodeQuery') as FormControl;
    const value = (this.localeCodeQueryList.find( item => item.cfl_locale_id === c_currentLocale) as CodeQueryModel).cfl_value;
    field.setValue(value);
  }

  ngOnInit(): void {
    this.init();
  }

}
