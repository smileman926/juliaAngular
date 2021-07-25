import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '@/app/helpers/api/api.service';
import { CountryInfoModel } from '@/app/main/models';

import {
  CreditCardTypeModel,
  CurrencyTypeModel,
  CustomPaymentTypeModel,
  PaymentMethodCountryModel,
  PaymentMethodLocaleModel,
  PaymentMethodModel
} from '@/app/main/window/content/my-company/payment/models';

import {
  CompanyInfoListModel, WorkflowModel
} from '@/app/main/window/content/my-company/operation-settings/models';

import { LocalInfoModel } from '@/app/main/window/content/web-tools/booking-tools/model';
@Injectable({
  providedIn: 'root',
})

export class ApiPaymentOptionsService {
  constructor(private apiService: ApiService) {}

  public getCompanyInfo(parameters?: {[key: string]: string | number}): Observable<CompanyInfoListModel> {
    return this.apiService.easybookingGet<CompanyInfoListModel>('apiHotel/company', parameters, undefined, 'getCompanyDetails');
  }

  public getPaymentMethodModel(): Observable<PaymentMethodModel[]> {
    return this.apiService.easybookingGet<PaymentMethodModel[]>('apiPayment/paymentMethod', undefined, undefined, 'getCompanyDetails');
  }

  public getCurrencyTypeModel(): Observable<CurrencyTypeModel[]> {
    return this.apiService.easybookingGet<CurrencyTypeModel[]>('apiPayment/currency', undefined, undefined, 'getCompanyDetails');
  }

  public getWorkflowModel(): Observable<WorkflowModel[]> {
    return this.apiService.easybookingGet<WorkflowModel[]>('apiHotel/workflow', undefined, undefined, 'getCompanyDetails');
  }

  public getPaymentMethodLocaleModel(parameters?: {[key: string]: string | number}): Observable<PaymentMethodLocaleModel[]> {
    return this.apiService.easybookingGet<PaymentMethodLocaleModel[]>(
      'apiPayment/paymentMethodLocale', parameters, undefined, 'getCompanyDetails'
      );
  }

  // TODO check if the list can be retrieved from company settings
  public getCountryInfoList(): Observable<CountryInfoModel[]> {
    return this.apiService.easybookingGet<CountryInfoModel[]>('apiHotel/country', undefined, undefined, 'getCompanyDetails');
  }

  public getPaymentMethodCountryModel(parameters?: {[key: string]: string | number}): Observable<PaymentMethodCountryModel[]> {
    return this.apiService.easybookingGet<PaymentMethodCountryModel[]>(
      'apiPayment/paymentMethodCountry', parameters, undefined, 'getCompanyDetails'
      );
  }

  public getCreditCardType(): Observable<CreditCardTypeModel[]> {
    return this.apiService.easybookingGet<CreditCardTypeModel[]>('apiPayment/creditCardType', undefined, undefined, 'getCompanyDetails');
  }

  public getCustomPaymentType(): Observable<CustomPaymentTypeModel[]> {
    return this.apiService.easybookingGet<CustomPaymentTypeModel[]>('apiPayment/customPaymentType');
  }

  public getLocaleInfoList(): Observable<LocalInfoModel[]> {
    return this.apiService.easybookingGet<LocalInfoModel[]>('apiHotel/locale', undefined, undefined, 'getCompanyDetails');
  }

  public postPaymentBodyRequest(
    url: string,
    propsData: {
    [field: string]: any;
    },
    isZero: boolean
  ): Observable<{ [field: string]: any }> {
    return this.apiService.saraSettingsPost(
      url,
      propsData,
      undefined,
      isZero ? 'getCompanyDetails' : undefined
    );
  }

  public addPaymentType(formData: FormData): Observable<string> {
    return this.apiService.addNewPaymentType(
      formData
    );
  }

  public deletePaymentMethodCountryModel(
    id: string
  ): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingDelete(
      'apiPayment/paymentMethodCountry',
      id,
      undefined,
      'getCompanyDetails'
    );
  }

  public deletePaymentType(
    id: string
  ): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingDelete(
      'apiPayment/customPaymentType',
      id
    );
  }

  public putBodyRequest(
    path: string,
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      path,
      id,
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public putOriginRequest(
    path: string,
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      path,
      id,
      postData
    );
  }

}

