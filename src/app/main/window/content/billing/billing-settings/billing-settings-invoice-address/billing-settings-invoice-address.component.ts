import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { CountryInfoModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { BillingGeneralModel } from '../model';

@Component({
  selector: 'app-billing-settings-invoice-address',
  templateUrl: './billing-settings-invoice-address.component.pug',
  styleUrls: ['./billing-settings-invoice-address.component.sass']
})
export class BillingSettingsInvoiceAddressComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public billingInfo: BillingGeneralModel;
  public locales: CountryInfoModel[] = [];

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiBilling.getBillingInfoModel().toPromise(),
      this.apiHotel.getCountryInfoModel().toPromise()
    ]);

    this.billingInfo = val1;
    this.locales = val2;

    this.form = new FormGroup({
      b_companyName: new FormControl(this.billingInfo.b_companyName),
      b_companyName_2: new FormControl(this.billingInfo.b_companyName_2),
      b_addressLine1: new FormControl(this.billingInfo.b_addressLine1),
      b_addressLine1_2: new FormControl(this.billingInfo.b_addressLine1_2),
      b_postCode: new FormControl(this.billingInfo.b_postCode),
      b_city: new FormControl(this.billingInfo.b_city),
      b_country_id: new FormControl(this.billingInfo.b_country_id)
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    await this.apiBilling.putBillingRequest('apiHotel/billing', {...this.form.getRawValue()}).toPromise();
  }

  ngOnInit(): void {
    this.init();
  }

}
