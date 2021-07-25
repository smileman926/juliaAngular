import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { MainService } from '@/app/main/main.service';
import { CountryInfoModel } from '@/app/main/models';
import { WorkflowModel } from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';
import { CreditCardTypeModel, PaymentMethodCountryModel, PaymentMethodLocaleModel } from '../models';
import { SetPaymentCountryComponent } from '../set-payment-country/set-payment-country.component';
import { TextTranslateComponent } from '../text-translate/text-translate.component';

@Component({
  selector: 'app-payment-credit-card',
  templateUrl: './payment-credit-card.component.pug',
  styleUrls: ['./payment-credit-card.component.sass']
})
export class PaymentCreditCardComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public defaultFirstTranslate: string;
  public defaultSecondTranslate: string;
  public translations: PaymentMethodLocaleModel[];
  public countryFullInfoList: CountryInfoModel[];
  public paymentCountryList: PaymentMethodCountryModel[];
  public creditCardTypeList: CreditCardTypeModel[];
  public workFlowList: WorkflowModel[];
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
    const [val1, val2, val3, val4, val5] = await Promise.all([
      this.apiPayment.getPaymentMethodLocaleModel({p3: 2}).toPromise(),
      this.apiPayment.getCountryInfoList().toPromise(),
      this.apiPayment.getPaymentMethodCountryModel({p3: 2}).toPromise(),
      this.apiPayment.getCreditCardType().toPromise(),
      this.apiPayment.getWorkflowModel().toPromise()
    ]);

    this.translations = val1;

    const defaultID = this.defaultLocale.toString();
    this.defaultFirstTranslate = this.translations.filter( item => item.pml_locale_id === defaultID)[0].pmal_genericTemplateText;
    this.defaultSecondTranslate = this.translations.filter( item => item.pml_locale_id === defaultID)[0].pmal_genericTemplateText2;

    this.countryFullInfoList = val2;
    const data = val3.sort(
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

    this.creditCardTypeList = val4;
    this.workFlowList = val5;

    const paymentWorkflow = this.workFlowList.find( item => item.w_name === 'creditCardSecurityCheck');
    const depositWorkflow = this.workFlowList.find( item => item.w_name === 'CreditCardSecurityCheckIgnorePrePayment');

    this.form = new FormGroup({
      c_forPayment: new FormControl(paymentWorkflow ? paymentWorkflow.w_value === 'on' : false),
      c_isDeposit: new FormControl(depositWorkflow ? depositWorkflow.w_value === 'on' : false),
      c_ccTypes: new FormArray(this.creditCardTypeList.map(item => new FormControl(item.cct_active === 'on')))
    });
  }

  @Loading(LoaderType.LOAD)
  public async setCheckBox(event: boolean, name: string): Promise<void> {
    const currentWorkflow = this.workFlowList.find(workflow => workflow.w_name === name);
    if (!currentWorkflow) {
      return;
    }
    const body = {
      w_id: currentWorkflow.w_id,
      w_value: event ? 'on' : 'off'
    };
    await this.apiPayment.putBodyRequest('apiHotel/workflow', currentWorkflow.w_id, body).toPromise();
  }

  @Loading(LoaderType.LOAD)
  public async onChange(event: boolean, index: number): Promise<void> {
    const body = {
      cct_id: (index + 1).toString(),
      cct_active: event ? 'on' : 'off'
    };
    await this.apiPayment.putBodyRequest('apiPayment/creditCardType', (index + 1).toString(), body).toPromise();
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      c_accountHolder: formVals.c_accountHolder,
      c_iban: formVals.c_iban,
      c_bankName: formVals.c_bankName,
      c_swift: formVals.c_swift
    };

    await this.apiPayment.putBodyRequest('apiHotel/company', '1', body).toPromise();
  }

  public getCountryName(id: string) {
    return this.countryFullInfoList.filter(item => item.c_id === id)[0].cl_name;
  }

  @Loading(LoaderType.LOAD)
  public async getDefaultTranslateText(id: string | number, order: boolean): Promise<string> {
    const res = await this.apiPayment.getPaymentMethodLocaleModel({p3: id}).toPromise();
    const res2 = res.filter(item => item.pml_locale_id === this.defaultLocale.toString())[0];
    return order ? res2.pmal_genericTemplateText : res2.pmal_genericTemplateText2;
  }

  public async changeTranslate(isFirst: boolean) {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', TextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    modalBody.init('2', isFirst);
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result.res);
      const initialValue = await this.getDefaultTranslateText('2', isFirst);
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
    modalBody.init(2);
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
