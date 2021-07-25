import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '@/app/helpers/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiJuliaAngularService {

  constructor(private apiService: ApiService) {}

  public setPCICheckbox(setCheckbox: boolean): Observable<string> {
    return this.apiService.easybookingPost('juliaAngular/PciNagscreenDonotShow', {dontshow: setCheckbox}
    );
  }
}
