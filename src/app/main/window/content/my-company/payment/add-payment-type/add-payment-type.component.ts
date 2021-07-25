import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-add-payment-type',
  templateUrl: './add-payment-type.component.pug',
  styleUrls: ['./add-payment-type.component.sass']
})
export class AddPaymentTypeComponent implements OnInit {

  public paymentTypeName: string;
  public isActive: boolean;
  public isLoading: Observable<boolean>;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_ADD_PAYMENT_TYPE);
    this.paymentTypeName = '';
    this.isActive = false;
  }

  @Loading(LoaderType.LOAD_ADD_PAYMENT_TYPE)
  public async save(): Promise<any> {
    const data = {
      name: this.paymentTypeName,
      active: this.isActive ? 'on' : 'off'
    };
    const result = await this.apiPayment.postPaymentBodyRequest('apiPayment/customPaymentType', data, false).toPromise();
    return result;
  }

  ngOnInit() {
  }

}
