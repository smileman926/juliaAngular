import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-add-billing-tax',
  templateUrl: './add-billing-tax.component.pug',
  styleUrls: ['./add-billing-tax.component.sass']
})
export class AddBillingTaxComponent implements OnInit {

  public taxValue: number | null;
  public isNonStandard: boolean;
  public isLoading: Observable<boolean>;

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ADD_TAX);
    this.taxValue = null;
    this.isNonStandard = false;
  }

  @Loading(LoaderType.ADD_TAX)
  public async save(): Promise<any> {
    const data = {
      t_decimal: this.taxValue,
      t_isNonStandardTax: this.isNonStandard ? 'on' : 'off',
      t_name: this.taxValue ? this.taxValue.toString() + '%' : ''
    };
    const result = await this.apiBilling.postBillingBodyRequest('apiHotel/tax', data, true).toPromise();
    return result;
  }

  ngOnInit() {
  }

}
