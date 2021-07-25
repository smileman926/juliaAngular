import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';
import { stringifyDate } from '@/app/helpers/date';
import { EnquiryPoolStatsModel, RawFeratelEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/models';

@Injectable({
  providedIn: 'root'
})
export class ApiEnquiryPoolService {

  constructor(private apiService: ApiService) { }

  getEnquiryPoolMaxId(): Observable<number> {
    return this.apiService.mainApiPost<string[]>(
      ['appUser'],
      'enquiryPool',
      'getEQPMaxId'
    ).pipe(map(
      result => +result[0]
    ));
  }

  pollForFeratelDesklineEnquiry(maxId: number): Observable<RawFeratelEnquiry | null> {
    return this.apiService.mainApiPost<RawFeratelEnquiry>(
      [{currentMaxId: maxId}, 'appUser'],
      'enquiryPool',
      'pollForFeratelDesklineEnquiry'
    ).pipe(map(
      result => {
        if (!result.ep_status) {
          return null;
        }
        return result;
      }
    ));
  }

  public getEnquiryPoolStatistics(fromDate: Date, untilDate: Date, source: string): Observable<EnquiryPoolStatsModel> {
    return this.apiService.easybookingGet<EnquiryPoolStatsModel>(
      'apiHotel/EnquiryPoolStats',
      undefined,
      `${source}/${stringifyDate(fromDate, false)}/${stringifyDate(untilDate, false)}`
      );
  }
}
