import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TaxListModel, Trigger } from '@/app/main/models';
import {
  BillingDefaultTextModel,
  BillingGeneralModel,
  CateringModel,
  TaxationV2Model,
  TaxPeriodModel } from '@/app/main/window/content/billing/billing-settings/model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBillingWorkbenchService {

  constructor(private apiService: ApiService) { }

  getCleanupChargeSeparateSetting(): Observable<boolean> {
    return this.apiService.mainApiPost<[Trigger]>(
      ['appUser'],
      'BillingWorkbench',
      'checkCleanupChargeSeparateSetting'
    ).pipe(
      map(value => !!value && value.length > 0 && value[0] === 'on')
    );
  }

  public getBillingInfoModel(): Observable<BillingGeneralModel> {
    return this.apiService.easybookingGet<BillingGeneralModel>('apiHotel/billing', undefined, undefined, 'getCompanyDetails');
  }

  public getBillingDefaultTextModel(): Observable<BillingDefaultTextModel[]> {
    return this.apiService.easybookingGet<BillingDefaultTextModel[]>
      ('apiHotel/billingDefaultText', undefined, undefined, 'getCompanyDetails');
  }

  public putBillingRequest(
    path: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.enquiryPoolSettingsPut<{ [field: string]: any }>(
      path,
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public putBillingRequestWithId(
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

  public getTaxListModel(): Observable<TaxListModel[]> {
    return this.apiService.easybookingGet<TaxListModel[]>('apiHotel/tax', undefined, undefined, 'getCompanyDetails');
  }

  public getTaxPeriodListModel(): Observable<TaxPeriodModel[]> {
    return this.apiService.easybookingGet<TaxPeriodModel[]>('apiHotel/taxationPeriod', undefined, undefined, 'getCompanyDetails');
  }

  public putTaxPeriodListRequest(
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.enquiryPoolSettingsPut<{ [field: string]: any }>(
      'apiHotel/taxationPeriod',
      postData
    );
  }

  public putTaxationV2Request(
    postData: {
      [field: string]: any;
    },
    isZero: boolean
  ): Observable<{ [field: string]: any }> {
    return this.apiService.enquiryPoolSettingsPut<{ [field: string]: any }>(
      'apiHotel/taxationV2',
      postData,
      undefined,
      undefined,
      isZero ? 'getCompanyDetails' : undefined
    );
  }

  public deleteTaxPeriodRequest(
    id: string,
  ): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingDelete(
      'apiHotel/taxationPeriod',
      id,
    );
  }

  public getCateringListModel(): Observable<CateringModel[]> {
    return this.apiService.easybookingGet<CateringModel[]>('apiHotel/catering');
  }

  public getTaxationV2Model(): Observable<TaxationV2Model> {
    return this.apiService.easybookingGet<TaxationV2Model>('apiHotel/taxationV2');
  }

  public postBillingBodyRequest(
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

  public deleteBillingRequest(
    path: string,
    id: string,
    isZero: boolean
  ): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingDelete(
      path,
      id,
      undefined,
      isZero ? 'getCompanyDetails' : undefined
    );
  }
}
