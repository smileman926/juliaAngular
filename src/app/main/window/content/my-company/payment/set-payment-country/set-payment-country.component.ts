import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { CacheService } from '@/app/helpers/cache.service';
import { Country } from '@/app/main/models';
import { isCountryActivated } from '@/app/main/window/content/my-company/payment/set-payment-country/is-country-activated.pipe';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { filterRealCountries, sortCountries } from '@/ui-kit/utils/countries';
import { LoaderType } from '../loader-types';
import { PaymentMethodCountryModel } from '../models';

@Component({
  selector: 'app-set-payment-country',
  templateUrl: './set-payment-country.component.pug',
  styleUrls: ['./set-payment-country.component.sass']
})
export class SetPaymentCountryComponent implements OnInit {

  public isLoading: Observable<boolean>;
  public countryFullInfoList: Country[];
  public paymentCountryList: PaymentMethodCountryModel[];
  public paymentCountryDefaultId: number;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    public loaderService: LoaderService,
    public cacheService: CacheService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_COUNTRY_SETTINGS);
  }

  @Loading(LoaderType.LOAD_COUNTRY_SETTINGS)
  public async init(id: number): Promise<void> {
    if (!this.countryFullInfoList) {
      const {countryDataProvider} = await this.cacheService.getCompanyDetails();
      this.countryFullInfoList = sortCountries(filterRealCountries(countryDataProvider));
    }
    this.paymentCountryDefaultId = id;
    this.paymentCountryList = await this.apiPayment.getPaymentMethodCountryModel({p3: id}).toPromise();
  }

  @Loading(LoaderType.LOAD_COUNTRY_SETTINGS)
  public async setPaymentCountry(country: Country) {
    if (isCountryActivated(country, this.paymentCountryList)) {
      const deleteId = this.paymentCountryList.filter( listItem => listItem.pmc_country_id === country.c_id)[0].pmc_id;
      await this.apiPayment.deletePaymentMethodCountryModel(deleteId).toPromise();
    } else {
      const obj = {
        c_name: country.c_name,
        pmc_country_id: country.c_id,
        pmc_paymentMethod_id: this.paymentCountryDefaultId.toString()
      };
      await this.apiPayment.postPaymentBodyRequest('apiPayment/paymentMethodCountry', obj, true).toPromise();
    }
    this.init(this.paymentCountryDefaultId);
  }

  @Loading(LoaderType.LOAD_COUNTRY_SETTINGS)
  public async activateAll() {
    await Promise.all(
      this.countryFullInfoList.map( async item => {
        const obj = {
          c_name: item.c_name,
          pmc_country_id: item.c_id,
          pmc_paymentMethod_id: this.paymentCountryDefaultId.toString()
        };
        await this.apiPayment.postPaymentBodyRequest('apiPayment/paymentMethodCountry', obj, true).toPromise();
      })
    );
    this.init(this.paymentCountryDefaultId).catch();
  }

  @Loading(LoaderType.LOAD_COUNTRY_SETTINGS)
  public async activateNone() {
    await Promise.all(
      this.paymentCountryList.map( async item => {
        await this.apiPayment.deletePaymentMethodCountryModel(item.pmc_id).toPromise();
      })
    );
    this.init(this.paymentCountryDefaultId).catch();
  }

  public getCountryName(name: string): string {
    if (name.length > 24) {
      return name.slice(0, 24) + '...';
    }
    return name;
  }

  public save(): PaymentMethodCountryModel[] {
    return this.paymentCountryList;
  }

  ngOnInit() { }

}
