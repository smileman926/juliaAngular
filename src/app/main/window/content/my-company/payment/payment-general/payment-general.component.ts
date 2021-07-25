import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CompanyInfoListModel, WorkflowModel } from '@/app/main/window/content/my-company/operation-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { LoaderType } from '../loader-types';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { CurrencyTypeModel, PaymentMethodModel } from '../models';

const paymentMethods = ['BankTransfer', 'CreditCard', 'PayPal', 'Sofort', 'Hobex'];

@Component({
  selector: 'app-payment-general',
  templateUrl: './payment-general.component.pug',
  styleUrls: ['./payment-general.component.sass']
})
export class PaymentGeneralComponent implements OnInit {

  public form: FormGroup;
  public companyInfos: CompanyInfoListModel;
  public isLoading: Observable<boolean>;
  public paymentMethods: PaymentMethodModel[];
  public workFlows: WorkflowModel[];
  public currencyTypes: CurrencyTypeModel[];
  public enabledPaymentMethods: string[] = [];
  public paymentMethodLabels: {[paymentMethodId: string]: string} = {
    BankTransfer: 'ebc.payment.BankTransfer.text',
    CreditCard: 'ebc.payment.CreditCard.text',
    PayPal: 'ebc.payment.editFormPPTitle.text',
    Sofort: 'ebc.payment.editFormSofortTitle.text',
    Hobex: 'Hobex'
  };

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3, val4] = await Promise.all([
      this.apiPayment.getCompanyInfo({p3: 1}).toPromise(),
      this.apiPayment.getPaymentMethodModel().toPromise(),
      this.apiPayment.getCurrencyTypeModel().toPromise(),
      this.apiPayment.getWorkflowModel().toPromise()
    ]);

    this.companyInfos = val1;
    this.paymentMethods = val2;
    this.currencyTypes = val3;
    this.workFlows = val4;

    const hobexMethod = this.paymentMethods.find(item => item.pm_name === 'Hobex');
    const hobexIsActive = !!hobexMethod && hobexMethod.pm_active === 'on';
    this.enabledPaymentMethods = paymentMethods.filter(paymentMethod => {
      switch (paymentMethod) {
        case 'CreditCard':
        case 'Sofort':
          return !hobexIsActive;
        case 'Hobex':
          return hobexIsActive;
        default:
          return true;
      }
    });

    this.form = new FormGroup({
      c_prePaymentActive: new FormControl(this.companyInfos.c_prePaymentActive === 'on'),
      c_prePaymentDaysAfterBooking: new FormControl(
        this.companyInfos.c_prePaymentDaysAfterBooking, [Validators.required, Validators.min(0)]
      ),
      c_prePaymentPerc: new FormControl(
        this.companyInfos.c_prePaymentPerc, [Validators.required, Validators.min(0)]
      ),
      c_currency_id: new FormControl(this.companyInfos.c_currency_id),
      c_prePaymentHideBankTransfer: new FormControl(this.companyInfos.c_prePaymentHideBankTransfer === 'on'),
      c_prePaymentUntilDaysBeforeBookingActive: new FormControl(this.companyInfos.c_prePaymentUntilDaysBeforeBookingActive === 'on'),
      c_prePaymentUntilDaysBeforeBooking: new FormControl(
        this.companyInfos.c_prePaymentUntilDaysBeforeBooking, [Validators.required, Validators.min(0)]
      ),
      c_sendEmailGuest: new FormControl(this.workFlows.filter(item => item.w_id === '16')[0].w_value === 'on'),
      c_sendEmailAdmin: new FormControl(this.workFlows.filter(item => item.w_id === '5')[0].w_value === 'on'),
      payMethods: new FormArray(this.paymentMethods.map( item => new FormControl(item.pm_active === 'on') )),
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      c_prePaymentActive: formVals.c_prePaymentActive ? 'on' : 'off',
      c_prePaymentDaysAfterBooking: formVals.c_prePaymentDaysAfterBooking,
      c_prePaymentPerc: formVals.c_prePaymentPerc,
      c_currency_id: formVals.c_currency_id,
      c_prePaymentHideBankTransfer: formVals.c_prePaymentHideBankTransfer ? 'on' : 'off',
      c_prePaymentUntilDaysBeforeBookingActive: formVals.c_prePaymentUntilDaysBeforeBookingActive ? 'on' : 'off',
      c_prePaymentUntilDaysBeforeBooking: formVals.c_prePaymentUntilDaysBeforeBooking,
    };

    await Promise.all([
      this.apiPayment.putBodyRequest('apiHotel/company', '1', body).toPromise(),
      this.apiPayment.putBodyRequest('apiHotel/workflow', '16', {w_value: formVals.c_sendEmailGuest ? 'on' : 'off'}).toPromise(),
      this.apiPayment.putBodyRequest('apiHotel/workflow', '5', {w_value: formVals.c_sendEmailAdmin ? 'on' : 'off'}).toPromise()
    ]);
  }
  @Loading(LoaderType.LOAD)
  public async onChange(event: boolean, index: number): Promise<void> {
    const body = {
      pm_id: (index + 1).toString(),
      pm_active: event ? 'on' : 'off'
    };
    await this.apiPayment.putBodyRequest('apiPayment/paymentMethod', (index + 1).toString(), body).toPromise();
  }

  ngOnInit(): void {
    this.init();
  }

}
