import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { GuestRegistrationConfigService } from '../../guest-registration-config.service';
import { LoaderType } from '../../loader-types';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.pug',
  styleUrls: ['./company.component.sass']
})
export class CompanyComponent {

  public isLoading: Observable<boolean>;

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.CompanyDetailsLoad);
  }
}
