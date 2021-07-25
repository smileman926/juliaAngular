import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { EnquiryPoolSettingsModel } from '../model';


@Component({
  selector: 'app-enquiry-poop-settings-general',
  templateUrl: './enquiry-poop-settings-general.component.pug',
  styleUrls: ['./enquiry-poop-settings-general.component.sass']
})
export class EnquiryPoopSettingsGeneralComponent implements OnInit {

  form: FormGroup;
  public enquiryInfo: EnquiryPoolSettingsModel;
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();

    const mainOptions = {
      c_epSettingAutoAnswerComment: formVals.c_epSettingAutoAnswerComment ? 'on' : 'off',
      c_epSettingAutoAnswerDeskline: formVals.c_epSettingAutoAnswerDeskline ? 'on' : 'off',
      c_epSettingAutoAnswerEnquiryForm: formVals.c_epSettingAutoAnswerEnquiryForm ? 'on' : 'off',
      c_epSettingSplitToMultipleRooms: formVals.c_epSettingSplitToMultipleRooms ? 'on' : 'off',
      c_epSettingFormDayTolerance: formVals.c_epSettingFormDayTolerance,
      c_epSettingManualAssignDayTolerance: formVals.c_epSettingManualAssignDayTolerance,
      id: this.enquiryInfo.id
    };

    await this.apiHotel.putEnquiryPoolSettingsModel(mainOptions).toPromise();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.enquiryInfo = await this.apiHotel.getEnquiryPoolSettingsModel().toPromise();

    this.form = new FormGroup({
      c_epSettingAutoAnswerComment: new FormControl(this.enquiryInfo.c_epSettingAutoAnswerComment === 'on'),
      c_epSettingAutoAnswerDeskline: new FormControl(this.enquiryInfo.c_epSettingAutoAnswerDeskline === 'on'),
      c_epSettingAutoAnswerEnquiryForm: new FormControl(this.enquiryInfo.c_epSettingAutoAnswerEnquiryForm === 'on'),
      c_epSettingSplitToMultipleRooms: new FormControl(this.enquiryInfo.c_epSettingSplitToMultipleRooms === 'on'),

      c_epSettingFormDayTolerance: new FormControl(Number(this.enquiryInfo.c_epSettingFormDayTolerance)),
      c_epSettingManualAssignDayTolerance: new FormControl(Number(this.enquiryInfo.c_epSettingManualAssignDayTolerance)),
    });

  }

  ngOnInit(): void {
    this.init();
  }

}
