import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  VistorsScreenSettings
} from '@/app/main/window/content/pricing-admin/visitors-tax-settings/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiVisitorsTaxSettingsService {
  constructor(private apiService: ApiService) { }

  getVisitorsTaxScreenSettings(data: {}): Observable<VistorsScreenSettings> {
    return this.apiService.easybookingPost<VistorsScreenSettings>(
      'visitorsTaxScreen/settings',
      data
    );
  }

  postVisitorsTaxScreenSettings(data: {[field: string]: any}): Observable<{status: string, errors: []}> {
    return this.apiService.easybookingPost<{status: string, errors: []}>(
      'visitorsTaxScreen/updateSettings',
      data
    );
  }

  deleteVisitorsTaxScreenSettings(data: {[field: string]: any}): Observable<{status: string, errors: []}> {
    return this.apiService.easybookingPost<{status: string, errors: []}>(
      'visitorsTaxScreen/deleteSettings',
      data
    );
  }
}
