import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

import { CountryInfoModel } from '@/app/main/models';
import { PortalAATDataInfo } from '@/app/main/window/content/my-company/portal-aat/model';
import { EntityInfo, EntityOwnerProfile, EntityOwnerRoomInfo } from '@/app/main/window/content/my-company/room-owner/models';
import { BlockDates, RawBlockDates } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { inverseReduceBlockDates, reduceBlockDates } from '@/app/main/window/content/pricing-admin/season-periods/reduce';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCompanyService {
  constructor(private apiService: ApiService) {}

  public getGeneralSettings(): Observable<BlockDates> {
    return this.apiService
      .mainApiPost<RawBlockDates>(
        ['appUser'],
        'GeneralSettings',
        'getGeneralSettings'
      )
      .pipe(map(reduceBlockDates));
  }

  public setGeneralSettings(blockDates: BlockDates): Observable<void> {
    const rawblockDates = blockDates && inverseReduceBlockDates(blockDates);
    return this.apiService.mainApiPost<void>(
      [rawblockDates, 'appUser'],
      'GeneralSettings',
      'setGeneralSettings'
    );
  }

  public getPortalAATData(): Observable<PortalAATDataInfo> {
    return this.apiService.easybookingGet<PortalAATDataInfo>('apiAustriaat/getData');
  }

  public putPortalAATData(
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPut<{ [field: string]: any }>(
      'apiAustriaat/updateData',
      postData
    );
  }

  public putPortalAATDataSubmit(): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPutWithNoObj<{ [field: string]: any }>(
      'apiAustriaat/submitData',
    );
  }

  public getEntityOwnerList(): Observable<EntityOwnerProfile[]> {
    return this.apiService.easybookingGet<EntityOwnerProfile[]>('apiHotel/entityOwner');
  }

  public postEntityOwner(
    propsData: {
    [field: string]: any;
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.saraSettingsPost(
      'apiHotel/entityOwner',
      propsData,
      undefined,
      'getCompanyDetails'
    );
  }

  public putEntityOwner(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/entityOwner',
      id,
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }


  public deleteEntityOwner(
    id: string
  ): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingDelete(
      'apiHotel/entityOwner',
      id,
      undefined,
      'getCompanyDetails'
    );
  }

  public getCountryInfoList(): Observable<CountryInfoModel[]> {
    return this.apiService.easybookingGet<CountryInfoModel[]>('apiHotel/country', undefined, undefined, 'getCompanyDetails');
  }

  public getEntityOwnerRoomList(parameters?: {[key: string]: string | number}): Observable<EntityOwnerRoomInfo[]> {
    return this.apiService.easybookingGet<EntityOwnerRoomInfo[]>('apiHotel/entityOwnerEntity', parameters);
  }

  public putEntityOwnerEntity(
    postData: {
      [field: string]: any;
    },
    parameters: {
      [key: string]: string | number
    }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPut<{ [field: string]: any }>('apiHotel/entityOwnerEntity', postData, '', parameters);
  }

  public getEntityList(): Observable<EntityInfo[]> {
    return this.apiService.easybookingGet<EntityInfo[]>('apiHotel/entity');
  }
}
