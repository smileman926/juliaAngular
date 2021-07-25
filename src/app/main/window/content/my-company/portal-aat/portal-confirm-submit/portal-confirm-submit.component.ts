import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-portal-confirm-submit',
  templateUrl: './portal-confirm-submit.component.pug',
  styleUrls: ['./portal-confirm-submit.component.sass']
})
export class PortalConfirmSubmitComponent implements OnInit {

  isActive: boolean;
  isInvalid: boolean;
  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiCompany: ApiCompanyService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_CONFIRM);
    this.isActive = false;
    this.isInvalid = false;
  }

  changeActivity(flag: boolean): void {
    this.isActive = flag;
    this.isInvalid = false;
  }

  @Loading(LoaderType.LOAD_CONFIRM)
  public async save(): Promise<any> {
    if ( !this.isActive ) {
      this.isInvalid = true;
      return false;
    } else {
      await this.apiCompany.putPortalAATDataSubmit().toPromise();
      return true;
    }
  }

  ngOnInit(): void { }

}
