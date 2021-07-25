import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { BookingTextsModel, BookingTextTranslateModel, LocalInfoModel } from '../../model';

@Component({
  selector: 'app-translate-text',
  templateUrl: './translate-text.component.pug',
  styleUrls: ['./translate-text.component.sass']
})
export class BookingTextTranslateComponent implements OnInit {
  public localeInfoList: LocalInfoModel[] = [];
  public tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link'],
  };
  public activeTabId: string;
  public selected: string;
  public isLoading: Observable<boolean>;
  public bookingTextType: string;
  public bookingLangs: BookingTextsModel[] = [];
  public form: FormGroup;
  public defaultLocale: string;
  public inputMaxLength: number;

  constructor(
    private apiHotel: ApiHotelService,
    private loaderService: LoaderService,
    private mainService: MainService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_MODAL);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.activeTabId = this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt';
  }

  @Loading(LoaderType.LOAD_MODAL)
  public async init(type: string, length?: number): Promise<void> {
    this.bookingTextType = type;
    this.inputMaxLength = length ? length : 100000;
    const result = await this.apiHotel.getLocaleInfoModel().toPromise();
    this.localeInfoList = result.filter( item => item.l_id !== '7' && item.l_active === 'on');

    await Promise.all(
      this.localeInfoList.map( async item => {
        const res = await this.apiHotel.getBookingTextTranslateModel(item.l_id).toPromise();
        this.bookingLangs.push({
          id: item.l_id,
          language: item.l_desc,
          vals: res
        });
      })
    );

    this.form = new FormGroup({
      localeDescEnUk: new FormControl(
        this.bookingLangs.find(item => item.id === '1') ?
        this.bookingLangs.filter(item => item.id === '1')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescDeAt: new FormControl(
        this.bookingLangs.find(item => item.id === '2') ?
        this.bookingLangs.filter(item => item.id === '2')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescNlNl: new FormControl(
        this.bookingLangs.find(item => item.id === '3') ?
        this.bookingLangs.filter(item => item.id === '3')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescItIt: new FormControl(
        this.bookingLangs.find(item => item.id === '4') ?
        this.bookingLangs.filter(item => item.id === '4')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescFrFr: new FormControl(
        this.bookingLangs.find(item => item.id === '5') ?
        this.bookingLangs.filter(item => item.id === '5')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescHuHu: new FormControl(
        this.bookingLangs.find(item => item.id === '6') ?
        this.bookingLangs.filter(item => item.id === '6')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
      localeDescRuRu: new FormControl(
        this.bookingLangs.find(item => item.id === '10') ?
        this.bookingLangs.filter(item => item.id === '10')[0].vals.filter(item => item.fer_name === this.bookingTextType)[0].fetl_text : ''
      ),
    });

    this.localeInfoList.map( item => {
      if (item.l_id !== this.defaultLocale) {
        this.tabSettings.buttons.push({
          id: item.l_desc,
          label: 'BackEnd_WikiLanguage.' + item.l_desc
        });
      }
    });
    const tempArray = this.localeInfoList;
    this.tabSettings.buttons.unshift({
      id: tempArray.filter( item => item.l_id === this.defaultLocale)[0].l_desc,
      label: 'BackEnd_WikiLanguage.' + tempArray.filter( item => item.l_id === this.defaultLocale)[0].l_desc
    });
  }

  @Loading(LoaderType.LOAD_MODAL)
  public async save(): Promise<any> {
    const promises = this.bookingLangs.map( async item => {
      const formVal = (this.form.get(item.language) as FormControl).value;
      if (item.vals.filter(childItem => childItem.fer_name === this.bookingTextType)[0].fetl_text !== formVal) {
        return this.apiHotel.putBookingTextTranslateModel(
          item.vals.filter(childItem => childItem.fer_name === this.bookingTextType)[0].fetl_id,
          {
            fetl_text: formVal
          }
        ).toPromise();
      }
    });
    const result = await Promise.all(promises);
    return {
      res: result,
      initVal: (this.form.get(this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt') as FormControl).value,
      type: this.bookingTextType
    };
  }

  ngOnInit() {
  }
}
