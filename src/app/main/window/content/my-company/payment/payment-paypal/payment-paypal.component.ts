import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { MainService } from '@/app/main/main.service';
import { CountryInfoModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';
import { PaymentMethodCountryModel, PaymentMethodLocaleModel, PaymentMethodModel } from '../models';
import { SetPaymentCountryComponent } from '../set-payment-country/set-payment-country.component';
import { TextTranslateComponent } from '../text-translate/text-translate.component';

@Component({
  selector: 'app-payment-paypal',
  templateUrl: './payment-paypal.component.pug',
  styleUrls: ['./payment-paypal.component.sass']
})
export class PaymentPaypalComponent implements OnInit {

  form: FormGroup;
  public payTypeList: PaymentMethodModel[];
  public isLoading: Observable<boolean>;
  public defaultFirstTranslate: string;
  public defaultSecondTranslate: string;
  public translations: PaymentMethodLocaleModel[];
  public countryFullInfoList: CountryInfoModel[];
  public paymentCountryList: PaymentMethodCountryModel[];
  public defaultLocale: string;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    private modalService: ModalService,
    public loaderService: LoaderService,
    private mainService: MainService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val3, val4, val5] = await Promise.all([
      this.apiPayment.getPaymentMethodModel().toPromise(),
      this.apiPayment.getPaymentMethodLocaleModel({p3: 3}).toPromise(),
      this.apiPayment.getCountryInfoList().toPromise(),
      this.apiPayment.getPaymentMethodCountryModel({p3: 3}).toPromise()
    ]);

    this.payTypeList = val1;
    this.translations = val3;
    const defaultID = this.defaultLocale.toString();
    this.defaultFirstTranslate = this.translations.filter( item => item.pml_locale_id === defaultID)[0].pmal_genericTemplateText;
    this.defaultSecondTranslate = this.translations.filter( item => item.pml_locale_id === defaultID)[0].pmal_chargeText;

    this.countryFullInfoList = val4;
    const data = val5.sort(
      (a, b) => (Number(a.pmc_country_id) > Number(b.pmc_country_id)) ? 1
      : ((Number(b.pmc_country_id) > Number(a.pmc_country_id)) ? -1 : 0)
    );
    this.paymentCountryList = [];
    const map = new Map();
    for (const item of data) {
        if (!map.has(item.pmc_country_id)) {
            map.set(item.pmc_country_id, true);
            this.paymentCountryList.push({
              pmc_country_id: item.pmc_country_id,
              pmc_id: item.pmc_id,
              pmc_paymentMethod_id: item.pmc_paymentMethod_id
            });
        }
    }

    this.form = new FormGroup({
      pm_accountId: new FormControl(this.payTypeList.filter(item => item.pm_name === 'PayPal')[0].pm_accountId, Validators.email),
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      pm_accountId: formVals.pm_accountId,
      pm_id: this.payTypeList.filter(item => item.pm_name === 'PayPal')[0].pm_id
    };

    await this.apiPayment.putBodyRequest(
      'apiPayment/paymentMethod',
      this.payTypeList.filter(item => item.pm_name === 'PayPal')[0].pm_id,
      body
    ).toPromise();
  }

  public getCountryName(id: string) {
    return this.countryFullInfoList.filter(item => item.c_id === id)[0].cl_name;
  }

  @Loading(LoaderType.LOAD)
  public async getDefaultTranslateText(id: string | number, order: boolean, isCharge?: boolean): Promise<string> {
    const res = await this.apiPayment.getPaymentMethodLocaleModel({p3: id}).toPromise();
    const res2 = res.filter(item => item.pml_locale_id === this.defaultLocale.toString())[0];
    return order ? res2.pmal_genericTemplateText : isCharge ? res2.pmal_chargeText : res2.pmal_genericTemplateText2;
  }

  public async changeTranslate(isFirst: boolean, isChargeText?: boolean) {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', TextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    modalBody.init('3', isFirst, isChargeText);
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result.res);
      const initialValue = await this.getDefaultTranslateText('3', isFirst, isChargeText);
      if (result.type) {
        this.defaultFirstTranslate = initialValue;
      } else {
        this.defaultSecondTranslate = initialValue;
      }
    });
  }

  public async setCountries() {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.activeCountrySettingPMCountry.text', SetPaymentCountryComponent, {
      primaryButtonLabel: 'ebc.buttons.close.text',
      disableClose: true,
      hideSecondaryButton: true,
      ngbOptions: {
        size: 'lg'
      },
    });
    modalBody.init(3);
    modal.save.subscribe( () => {
      const result = modalBody.save();
      this.paymentCountryList = result.sort(
        (a, b) => (Number(a.pmc_country_id) > Number(b.pmc_country_id)) ? 1
        : ((Number(b.pmc_country_id) > Number(a.pmc_country_id)) ? -1 : 0)
      );
      modal.close(!!result);
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
