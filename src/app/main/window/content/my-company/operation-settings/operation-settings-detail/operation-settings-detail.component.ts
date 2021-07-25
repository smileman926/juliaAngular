import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { LanguageService } from '@/app/i18n/language.service';
import { CountryInfoModel } from '@/app/main/models';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';

import {
  CompanyInfoListModel,
  CompanyInfoModel,
  DateFormatModel,
  EmailTemplateModel
} from '@/app/main/window/content/my-company/operation-settings/models';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-operation-settings-detail',
  templateUrl: './operation-settings-detail.component.pug',
  styleUrls: ['./operation-settings-detail.component.sass']
})
export class OperationSettingsDetailComponent implements OnInit {

  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public countryID: string;
  public countryDetailList: CountryInfoModel[];
  public dateFormatID: string;
  public dateFormatList: DateFormatModel[];
  public emailTemp: EmailTemplateModel;
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private languageService: LanguageService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();

    const bodyAdds = {
      c_defaultCountry_id: formVals.c_currentCountryID,
      c_dateFormat_id: formVals.c_dateFormatID,
      c_displayCategoryForSpecialOffer: formVals.c_displayCategoryForSpecialOffer ? 'on' : 'off',
      c_noSplittingOutForSpecialOffers: formVals.c_noSplittingOutForSpecialOffers ? 'on' : 'off',
      c_hideCatering: formVals.c_hideCatering ? 'on' : 'off',
      c_useRoundingHack: formVals.c_useRoundingHack ? 'on' : 'off',
      c_ervAlwaysIncluded: formVals.c_ervAlwaysIncluded ? 'on' : 'off',
      c_notObligedToCashRegisterLaw: formVals.c_notObligedToCashRegisterLaw ? 'on' : 'off',
      c_channelManagerAutoCalc: formVals.c_channelManagerAutoCalc ? 'on' : 'off',
      c_displayVisitorsTax: formVals.c_displayVisitorsTax ? 'on' : 'off',
      c_displayCleanupCharge: formVals.c_displayCleanupCharge ? 'on' : 'off',
      c_displayPetCharge: formVals.c_displayPetCharge ? 'on' : 'off',
      c_displayCotCharge: formVals.c_displayCotCharge ? 'on' : 'off',
      c_displayCatering: formVals.c_displayCatering ? 'on' : 'off',
      c_displayGarage: formVals.c_displayGarage ? 'on' : 'off',
      c_displayEarlyBirdDiscount: formVals.c_displayEarlyBirdDiscount ? 'on' : 'off',
      c_displayLongStayDiscount: formVals.c_displayLongStayDiscount ? 'on' : 'off',
      c_displayOtherCharges: formVals.c_displayOtherCharges ? 'on' : 'off',
      c_displayShortStayCharge: formVals.c_displayShortStayCharge ? 'on' : 'off',
      c_displayLastMinuteDiscount: formVals.c_displayLastMinuteDiscount ? 'on' : 'off',
      c_displayWishroomCharge: formVals.c_displayWishroomCharge ? 'on' : 'off',
    };
    await Promise.all([
      this.apiHotel
        .putCompanyModel(bodyAdds)
        .toPromise(),
      this.apiHotel
        .putEmailTemplateModel({
          et_showHotelInfoOnPDF: formVals.c_isShowInfo ? 'on' : 'off'
        })
        .toPromise()
    ]);
    if ( formVals.c_dateFormatID !== this.dateFormatID || formVals.c_currentCountryID !== this.countryID ) {
      window.location.reload();
    }
    this.init();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3, val4] = await Promise.all([
      this.apiHotel.getCompanyModel().toPromise(),
      this.apiHotel.getEmailTemplateModel().toPromise(),
      this.apiHotel.getCountryInfoModel().toPromise(),
      this.apiHotel.getDateFormatListModel().toPromise()
    ]);
    this.itemsList = val1;
    this.items = this.itemsList['0'];
    this.countryID = this.items.c_defaultCountry_id;
    this.dateFormatID = this.items.c_dateFormat_id;
    this.emailTemp = val2[0];
    this.countryDetailList = val3.filter( item => item.c_active === 'on');
    this.dateFormatList = val4;
    const moment = require('moment');
    const today = moment();
    this.dateFormatList.map( item => item.df_display = item.df_display + ' - ' + today.format(item.df_format));

    this.form = new FormGroup({
      c_isShowInfo: new FormControl(this.emailTemp.et_showHotelInfoOnPDF === 'on'),
      c_currentCountryID: new FormControl(this.countryID),
      c_dateFormatID: new FormControl(this.dateFormatID),
      c_displayCategoryForSpecialOffer: new FormControl(this.items.c_displayCategoryForSpecialOffer === 'on'),
      c_noSplittingOutForSpecialOffers: new FormControl(this.items.c_noSplittingOutForSpecialOffers === 'on'),
      c_hideCatering: new FormControl(this.items.c_hideCatering === 'on'),
      c_useRoundingHack: new FormControl(this.items.c_useRoundingHack === 'on'),
      c_ervAlwaysIncluded: new FormControl(this.items.c_ervAlwaysIncluded === 'on'),
      c_notObligedToCashRegisterLaw: new FormControl(this.items.c_notObligedToCashRegisterLaw === 'on'),
      c_channelManagerAutoCalc: new FormControl(this.items.c_channelManagerAutoCalc === 'on'),
      c_displayVisitorsTax: new FormControl(this.items.c_displayVisitorsTax === 'on'),
      c_displayCleanupCharge: new FormControl(this.items.c_displayCleanupCharge === 'on'),
      c_displayPetCharge: new FormControl(this.items.c_displayPetCharge === 'on'),
      c_displayCotCharge: new FormControl(this.items.c_displayCotCharge === 'on'),
      c_displayCatering: new FormControl(this.items.c_displayCatering === 'on'),
      c_displayGarage: new FormControl(this.items.c_displayGarage === 'on'),
      c_displayEarlyBirdDiscount: new FormControl(this.items.c_displayEarlyBirdDiscount === 'on'),
      c_displayLongStayDiscount: new FormControl(this.items.c_displayLongStayDiscount === 'on'),
      c_displayOtherCharges: new FormControl(this.items.c_displayOtherCharges === 'on'),
      c_displayShortStayCharge: new FormControl(this.items.c_displayShortStayCharge === 'on'),
      c_displayLastMinuteDiscount: new FormControl(this.items.c_displayLastMinuteDiscount === 'on'),
      c_displayWishroomCharge: new FormControl(this.items.c_displayWishroomCharge === 'on')
    });
  }

  openReference(): void {
    redirectWithPOST(
      getUrl('/wo/Services/com/gotoacademy.php'),
      {
        screen: 'settingsSurchargesExtra',
        l_id: String(this.languageService.getLanguageId())
      }
    );
  }

  ngOnInit(): void {
    this.init();
  }

}
