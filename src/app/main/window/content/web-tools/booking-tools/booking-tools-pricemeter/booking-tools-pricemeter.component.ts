import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { UserService } from '@/app/auth/user.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { LanguageService } from '@/app/i18n/language.service';
import { MainService } from '@/app/main/main.service';
import { RawCustomerItemDetails } from '@/app/main/window/content/administration/customers/models';
import { redirectWithPOST } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { ModalService } from '@/ui-kit/services/modal.service';
import { BookingTextTranslateComponent } from '../booking-tools-texts/translate-text/translate-text.component';
import { LoaderType } from '../loader-types';
import {
  BookingTextTranslateInitValueModel,
  BookingTextTranslateModel,
  CorporateIdentityListModel,
  CorporateIdentityModel } from '../model';


@Component({
  selector: 'app-booking-tools-pricemeter',
  templateUrl: './booking-tools-pricemeter.component.pug',
  styleUrls: ['./booking-tools-pricemeter.component.sass']
})
export class BookingToolsPricemeterComponent implements OnInit {

  public globalCustomerInfoModel: RawCustomerItemDetails;
  public isLoading: Observable<boolean>;
  public dbName: string;
  public isShowPrice: boolean;
  public textTypes: BookingTextTranslateInitValueModel[];
  public bookingTextTranslations: BookingTextTranslateModel[];
  public defaultLocale: string;
  public form: FormGroup;
  public corIdentity: CorporateIdentityModel;
  public corIdentityList: CorporateIdentityListModel;
  public urlSafe: SafeResourceUrl;
  public remoteUrl = environment.remoteUrl;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private modalService: ModalService,
    private mainService: MainService,
    private userService: UserService,
    private languageService: LanguageService,
    public sanitizer: DomSanitizer
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    const { dbName } = this.mainService.getCompanyDetails();
    this.dbName = dbName;
    this.isShowPrice = false;
    this.textTypes = [];
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id;
  }

  decimalToColor(decimal: string): string {
    let hex = Number(decimal).toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    return '#' + hex;
  }

  colorToDecimal(color: string): string {
    return parseInt(color.replace('#', ''), 16).toString();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const url = this.remoteUrl
      + 'ebPlugins/widgetTestSite.php?plugin=priceometer&'
      + 'cid=' + this.userService.hotelId
      + '&lid=' + this.languageService.getLanguageId();
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const [val1, val2, val3] = await Promise.all([
      this.apiHotel.getGlobalCustomerInfo(this.dbName).toPromise(),
      this.apiHotel.getBookingTextTranslateModel(this.defaultLocale).toPromise(),
      this.apiHotel.getCorporateIdentityModel().toPromise()
    ]);
    this.globalCustomerInfoModel = val1;
    this.isShowPrice = this.globalCustomerInfoModel.c_webWidget === 'on';
    this.bookingTextTranslations = val2;
    this.bookingTextTranslations.map( item => {
      switch (item.fer_name) {
        case 'priceOMeterTextBig':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'priceOMeterTextBig',
            pureType: 'priceOMeterTextBig',
            value: item.fetl_text
          });
          break;
        case 'priceOMeterTextSmall':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'priceOMeterTextSmall',
            pureType: 'priceOMeterTextSmall',
            value: item.fetl_text
          });
          break;
        default:
          break;
      }
    });
    this.corIdentity = val3;
    this.corIdentityList = this.corIdentity[0];
    this.corIdentityList.ci_priceOMeterButtonMainColor = this.decimalToColor(this.corIdentityList.ci_priceOMeterButtonMainColor);
    this.corIdentityList.ci_priceOMeterButtonFontColor = this.decimalToColor(this.corIdentityList.ci_priceOMeterButtonFontColor);
    this.corIdentityList.ci_priceOMeterPriceFontColor = this.decimalToColor(this.corIdentityList.ci_priceOMeterPriceFontColor);
    this.form = new FormGroup({
      ci_priceOMeterCustomFeratelName: new FormControl(this.corIdentityList.ci_priceOMeterCustomFeratelName, Validators.required)
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const body = {
      ci_priceOMeterCustomFeratelName: this.form.getRawValue().ci_priceOMeterCustomFeratelName,
      ci_priceOMeterButtonMainColor: this.colorToDecimal(this.corIdentityList.ci_priceOMeterButtonMainColor),
      ci_priceOMeterButtonFontColor: this.colorToDecimal(this.corIdentityList.ci_priceOMeterButtonFontColor),
      ci_priceOMeterPriceFontColor: this.colorToDecimal(this.corIdentityList.ci_priceOMeterPriceFontColor)
    };
    await this.apiHotel.putCorporateIdentityModel(this.corIdentityList.ci_id, body).toPromise();
  }

  openReference(): void {
    redirectWithPOST(
      'https://www.easybooking.academy/web-tools/preisvergleich',
      {
        target: 'hotelManagement_Settings_videoTab'
      }
    );
  }

  public async changeTranslate(type: string) {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', BookingTextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    switch (type) {
      case 'priceOMeterTextBig':
        modalBody.init('priceOMeterTextBig', 18);
        break;
      case 'priceOMeterTextSmall':
        modalBody.init('priceOMeterTextSmall', 30);
        break;
      default:
        break;
    }
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      this.textTypes.filter(item => item.pureType === result.type)[0].value = result.initVal;
      modal.close(!!result.res);
    });
  }

  ngOnInit() {
    this.init();
  }

}
