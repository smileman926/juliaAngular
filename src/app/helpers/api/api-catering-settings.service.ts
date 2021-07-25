import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';

import {
  reduceCateringDetails,
  reduceCaterings,
  reduceCompanyCateringConfig
} from '@/app/main/window/content/pricing-admin/catering-settings/reduce';

import {
  Catering, CateringDetails,
  CompanyCateringConfig, RawCatering, RawCateringDetails,
  RawCompanyCateringConfig, SaveCateringResponse
} from '@/app/main/window/content/pricing-admin/catering-settings/models';

@Injectable({
  providedIn: 'root'
})
export class ApiCateringSettingsService {

  constructor(
    private apiService: ApiService
  ) {}

  public getCompanyCateringConfig(): Observable<CompanyCateringConfig> {
    return this.apiService.easybookingGet<RawCompanyCateringConfig>('apiHotel/companyCateringConfig').pipe(
      map(reduceCompanyCateringConfig)
    );
  }

  public getCaterings(): Observable<Catering[]> {
    return this.apiService.easybookingGet<RawCatering[]>('apiHotel/catering').pipe(
      map((resp) => resp.map(reduceCaterings))
    );
  }

  public getCateringDetails(cateringId: number): Observable<CateringDetails> {
    return this.apiService.easybookingGet<RawCateringDetails>('apiHotel/serviceTypeDetail', undefined, cateringId.toString()).pipe(
      map(reduceCateringDetails)
    );
  }

  public putCompanyCateringConfig(postData: { [field: string]: any } | FormData, cId: number): Observable<SaveCateringResponse> {
    return this.apiService.easybookingPut<SaveCateringResponse>('apiHotel/companyCateringConfig', postData, cId.toString());
  }

  public putCateringDetails(postData: { [field: string]: any } | FormData, serviceTypeId: number): Observable<SaveCateringResponse> {
    return this.apiService.easybookingPut<SaveCateringResponse>('apiHotel/serviceTypeDetail', postData, serviceTypeId.toString());
  }
}
