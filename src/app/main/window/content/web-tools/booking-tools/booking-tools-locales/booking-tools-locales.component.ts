import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormGroup } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';

import { CompanyInfoListModel, CompanyInfoModel } from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { LocalInfoModel } from '../model';

import { RefreshCateringSettings } from '@/app/main/window/content/pricing-admin/catering-settings/events';
import { EventBusService } from '@/app/main/window/shared/event-bus';

@Component({
  selector: 'app-booking-tools-locales',
  templateUrl: './booking-tools-locales.component.pug',
  styleUrls: ['./booking-tools-locales.component.sass']
})
export class BookingToolsLocalesComponent implements OnInit {

  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public localeID: string;
  public localeInfoList: LocalInfoModel[];
  public isLoading: Observable<boolean>;
  public isShowToolTipContent: boolean;

  constructor(
    private apiHotel: ApiHotelService,
    private eventBus: EventBusService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.localeInfoList = [];
    this.isShowToolTipContent = false;
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    await Promise.all([
      this.apiHotel
        .putCompanyBookingModel({c_feLocale_id: this.localeID})
        .toPromise(),
      this.localeInfoList.map( async item => {
        await this.apiHotel.putLocaleInfoModel( item.l_id, {
          l_active: item.l_active
        }).toPromise();
      })
    ]);
    this.eventBus.emit<RefreshCateringSettings>('refreshCateringSettings', null);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiHotel.getCompanyBookingModel().toPromise(),
      this.apiHotel.getLocaleInfoModel().toPromise()
    ]);
    this.itemsList = val1;
    this.items = this.itemsList['0'];
    this.localeID = this.items.c_feLocale_id;
    this.localeInfoList = val2.filter( item => item.l_id !== '7');
  }

  changeDefault(event: boolean, item: LocalInfoModel): void {
    this.localeID = item.l_id;
  }

  changeStatus(event: boolean, val: LocalInfoModel): void {
    (this.localeInfoList.find( item => item.l_id === val.l_id) as LocalInfoModel).l_active = val.l_active === 'on' ? 'off' : 'on';
  }

  showToolTipContent(flag: boolean): void {
    this.isShowToolTipContent = flag;
  }

  ngOnInit(): void {
    this.init();
  }

}
