import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';
import { LocalInfoModel } from '@/app/main/window/content/web-tools/booking-tools/model';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { LoaderType } from '../loader-types';
import { BillingDefaultTextModel, TranslateTextGroupModel } from '../model';


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
  public billingLangs: TranslateTextGroupModel[] = [];
  public selected: string;
  public isLoading: Observable<boolean>;
  public translations: BillingDefaultTextModel[];
  public form: FormGroup;

  constructor(
    private apiHotel: ApiHotelService,
    private apiBilling: ApiBillingWorkbenchService,
    private loaderService: LoaderService,
    private mainService: MainService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TRANSLATION_MODAL);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.activeTabId = this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt';
  }

  @Loading(LoaderType.TRANSLATION_MODAL)
  public async init(): Promise<void> {

    const result = await this.apiHotel.getLocaleInfoModel().toPromise();
    this.localeInfoList = result.filter( item => item.l_id !== '7' && item.l_active === 'on');

    this.translations = await this.apiBilling.getBillingDefaultTextModel().toPromise();

    this.localeInfoList.map( item => {
      this.billingLangs.push({
        id: item.l_id,
        language: item.l_desc,
        value: this.translations.filter( l => l.bdt_locale_id === item.l_id)[0].bdt_text
      });
    });

    this.form = new FormGroup({
      langs: new FormArray(this.billingLangs.map(lang => new FormControl(lang.value)))
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

  @Loading(LoaderType.TRANSLATION_MODAL)
  public async save(): Promise<any> {
    const promises = this.billingLangs.map( async (item, index) => {
      const formVal = (this.form.get('langs') as FormArray).at(index).value;
      if (item.value !== formVal) {
        return this.apiBilling.putBillingRequestWithId(
          'apiHotel/billingDefaultText',
          item.id,
          {
            bdt_locale_id: item.id,
            bdt_text: formVal
          }
        ).toPromise();
      }
    });

    const result = await Promise.all(promises);
    return {
      res: result
    };
  }

  ngOnInit() {
  }

}
