import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { format } from 'date-fns';
import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import {
  CompanyInfoListModel,
  CompanyInfoModel,
} from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { BookingEntityGroupModel, BookingSeasonPeriodModel } from '../model';

@Component({
  selector: 'app-booking-tools-gapfilter',
  templateUrl: './booking-tools-gapfilter.component.pug',
  styleUrls: ['./booking-tools-gapfilter.component.sass']
})
export class BookingToolsGapfilterComponent implements OnInit {

  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public seasonList: BookingSeasonPeriodModel[];
  public entityGroupList: BookingEntityGroupModel[];
  public isLoading: Observable<boolean>;


  constructor(
    public datepipe: DatePipe,
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const seasonChecks = formVals.seasons.map(item => item ? 'on' : 'off');

    const bodyAdds = {
      c_gapFillEnabled: formVals.c_gapFillEnabled ? 'on' : 'off',
      c_gapFillIgnoreArrival: formVals.c_gapFillIgnoreArrival ? 'on' : 'off',
      c_gapFillIgnoreDeparture: formVals.c_gapFillIgnoreDeparture ? 'on' : 'off',
    };

    await Promise.all([
      this.apiHotel
        .putCompanyBookingModel(bodyAdds)
        .toPromise(),

      this.seasonList.map(async (item, index) => {
        if (item.sp_gapFillEnabled !== seasonChecks[index]) {
          await this.apiHotel.putBookingSeasonPeriodModel(item.sp_id, {
            sp_id: item.sp_id,
            sp_gapFillEnabled: seasonChecks[index]
          }).toPromise();
        }
      }),
      this.entityGroupList.map(async (item, index) => {
        if (item.eg_gapFillMinStay !== formVals.entities[index]) {
          await this.apiHotel.putBookingEntityGroupModel(item.eg_id, {
            eg_id: item.eg_id,
            eg_gapFillMinStay: formVals.entities[index]
          }).toPromise();
        }
      })
    ]);
    // this.init();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [bookings, seasons, categories] = await Promise.all([
      this.apiHotel.getCompanyBookingModel().toPromise(),
      this.apiHotel.getBookingSeasonPeriodModel().toPromise(),
      this.apiHotel.getBookingEntityGroupModel().toPromise()
    ]);
    const todayStr = format(new Date(), 'YYYY-MM-DD 00:00:00');
    this.itemsList = bookings;
    this.items = this.itemsList['0'];
    this.seasonList = seasons.filter(item => item.sp_untilDate > todayStr);
    this.entityGroupList = categories;

    this.form = new FormGroup({
      c_gapFillEnabled: new FormControl(this.items.c_gapFillEnabled === 'on'),
      c_gapFillIgnoreArrival: new FormControl(this.items.c_gapFillIgnoreArrival === 'on'),
      c_gapFillIgnoreDeparture: new FormControl(this.items.c_gapFillIgnoreDeparture === 'on'),
      seasons: new FormArray(this.seasonList.map( item => new FormControl(item.sp_gapFillEnabled === 'on') )),
      entities: new FormArray(this.entityGroupList.map( item => new FormControl(Number(item.eg_gapFillMinStay))))
    });

    if (this.items.c_gapFillEnabled === 'off') {
      (this.form.get('c_gapFillIgnoreArrival') as FormControl).disable();
      (this.form.get('c_gapFillIgnoreDeparture') as FormControl).disable();
      (this.form.get('seasons') as FormArray).controls.map( control => control.disable());
      (this.form.get('entities') as FormArray).controls.map( control => control.disable());
    }
    this.onChanges();
  }

  onChanges(): void {
    (this.form.get('c_gapFillEnabled') as FormControl).valueChanges.subscribe(val => {
      if (val) {
        (this.form.get('c_gapFillIgnoreArrival') as FormControl).enable();
        (this.form.get('c_gapFillIgnoreDeparture') as FormControl).enable();
        (this.form.get('seasons') as FormArray).controls.map( control => control.enable());
        (this.form.get('entities') as FormArray).controls.map( control => control.enable());

      } else {
        (this.form.get('c_gapFillIgnoreArrival') as FormControl).disable();
        (this.form.get('c_gapFillIgnoreDeparture') as FormControl).disable();
        (this.form.get('seasons') as FormArray).controls.map( control => control.disable());
        (this.form.get('entities') as FormArray).controls.map( control => control.disable());
      }
    });
  }

  getPeriodFunc(item: BookingSeasonPeriodModel): string {
    const fromDate = new Date(item.sp_fromDate);
    const todate = new Date(item.sp_untilDate);
    return this.datepipe.transform(fromDate, 'dd.MM.yyyy') + ' - ' + this.datepipe.transform(todate, 'dd.MM.yyyy');
  }

  ngOnInit(): void {
    this.init();
  }

}
