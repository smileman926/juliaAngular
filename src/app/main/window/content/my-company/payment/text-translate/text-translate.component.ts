import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { MainService } from '@/app/main/main.service';
import { LocalInfoModel } from '@/app/main/window/content/web-tools/booking-tools/model';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { LoaderType } from '../loader-types';
import { PaymentMethodLocaleModel, TranslateTextGroupModel } from '../models';

@Component({
  selector: 'app-text-translate',
  templateUrl: './text-translate.component.pug',
  styleUrls: ['./text-translate.component.sass']
})
export class TextTranslateComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link'],
  };
  public localeInfoList: LocalInfoModel[] = [];
  public activeTabId: string;
  public defaultLocale: string;
  public bookingLangs: TranslateTextGroupModel[] = [];
  public selected: string;
  public isLoading: Observable<boolean>;
  public translations: PaymentMethodLocaleModel[];
  public form: FormGroup;
  public isFirstTranslate: boolean;
  public isCharge: boolean;

  public editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }, {background: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };

  constructor(
    private apiHotel: ApiHotelService,
    private apiPayment: ApiPaymentOptionsService,
    private loaderService: LoaderService,
    private mainService: MainService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_TRANSLATE);
    this.isFirstTranslate = true;
    this.isCharge = false;
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.activeTabId = this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt';
  }

  @Loading(LoaderType.LOAD_TRANSLATE)
  public async init(id: string, order: boolean, isChargeText?: boolean): Promise<void> {

    const result = await this.apiHotel.getLocaleInfoModel().toPromise();
    this.localeInfoList = result.filter( item => item.l_id !== '7' && item.l_active === 'on');
    this.isFirstTranslate = order;
    if (isChargeText) {
      this.isCharge = isChargeText;
    }

    this.translations = await this.apiPayment.getPaymentMethodLocaleModel({p3: id}).toPromise();

    this.localeInfoList.map( item => {
      this.bookingLangs.push({
        id: item.l_id,
        language: item.l_desc,
        value: this.translations.filter( l => l.pml_locale_id === item.l_id)[0]
      });
    });

    this.form = new FormGroup({
      langs: new FormArray(this.bookingLangs.map(lang => new FormControl(
        order ? lang.value.pmal_genericTemplateText
          :
          isChargeText ? lang.value.pmal_chargeText
            : lang.value.pmal_genericTemplateText2
      )))
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

  @Loading(LoaderType.LOAD_TRANSLATE)
  public async save(): Promise<any> {
    const promises = this.bookingLangs.map( async (item, index) => {
      const formVal = (this.form.get('langs') as FormArray).at(index).value;
      if ( this.isFirstTranslate ) {
        if (item.value.pmal_genericTemplateText !== formVal) {
          return this.apiPayment.putBodyRequest(
            'apiPayment/paymentMethodLocale',
            item.value.pml_id,
            {
              pmal_genericTemplateText: formVal
            }
          ).toPromise();
        }
      } else {
        if ( this.isCharge ) {
          if (item.value.pmal_chargeText !== formVal) {
            return this.apiPayment.putBodyRequest(
              'apiPayment/paymentMethodLocale',
              item.value.pml_id,
              {
                pmal_chargeText: formVal
              }
            ).toPromise();
          }
        } else {
          if (item.value.pmal_genericTemplateText2 !== formVal) {
            return this.apiPayment.putBodyRequest(
              'apiPayment/paymentMethodLocale',
              item.value.pml_id,
              {
                pmal_genericTemplateText2: formVal
              }
            ).toPromise();
          }
        }
      }
    });

    const result = await Promise.all(promises);
    return {
      res: result,
      type: this.isFirstTranslate
    };
  }

  ngOnInit() {
  }

}
