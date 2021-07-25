import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { ThankyouPagePartnerModel } from '../model';

@Component({
  selector: 'app-booking-tools-partner',
  templateUrl: './booking-tools-partner.component.pug',
  styleUrls: ['./booking-tools-partner.component.sass']
})
export class BookingToolsPartnerComponent implements OnInit {

  form: FormGroup;
  public partnerModelList: ThankyouPagePartnerModel[];
  public isAlpinChecked: boolean;
  public isShowToolTipContent: boolean;
  public monthList: string[] = [
    '--', 'ebc.dates.month01.text', 'ebc.dates.month02.text', 'ebc.dates.month03.text', 'ebc.dates.month04.text',
    'ebc.dates.month05.text', 'ebc.dates.month06.text', 'ebc.dates.month07.text', 'ebc.dates.month08.text',
    'ebc.dates.month09.text', 'ebc.dates.month10.text', 'ebc.dates.month11.text', 'ebc.dates.month12.text'];
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isAlpinChecked = false;
    this.isShowToolTipContent = false;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {

    this.partnerModelList = await this.apiHotel.getThankyouPartnerModel().toPromise();
    const alpinPartner = this.partnerModelList.find( item => item.typp_name === 'Alpinresorts') as ThankyouPagePartnerModel;
    this.isAlpinChecked = alpinPartner.typp_active === 'on';

    this.form = new FormGroup({
      holidayFrom: new FormControl(Number(alpinPartner.typp_fromMonth)),
      holidayTo: new FormControl(Number(alpinPartner.typp_untilMonth))
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = this.partnerModelList.find( item => item.typp_name === 'Alpinresorts') as ThankyouPagePartnerModel;
    body.typp_active = this.isAlpinChecked ? 'on' : 'off';
    body.typp_fromMonth = formVals.holidayFrom.toString();
    body.typp_untilMonth = formVals.holidayTo.toString();
    await this.apiHotel.putThankyouPartnerModel(body.typp_id, body).toPromise();
  }

  checkAlpin(): void {
    this.isAlpinChecked = !this.isAlpinChecked;
  }

  showToolTipContent(flag: boolean): void {
    this.isShowToolTipContent = flag;
  }

  ngOnInit(): void {
    this.init();
  }

}
