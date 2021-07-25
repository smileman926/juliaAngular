import { Pipe, PipeTransform } from '@angular/core';

import { Country } from '@/app/main/models';
import { PaymentMethodCountryModel } from '@/app/main/window/content/my-company/payment/models';

@Pipe({
  name: 'isCountryActivated'
})
export class IsCountryActivatedPipe implements PipeTransform {

  transform(country: Country, paymentCountries: PaymentMethodCountryModel[]): boolean {
    return isCountryActivated(country, paymentCountries);
  }

}

export function isCountryActivated(country: Country, paymentCountries: PaymentMethodCountryModel[]): boolean {
  if (!paymentCountries) {
    return false;
  }
  return !!paymentCountries.find( paymentCountry => paymentCountry.pmc_country_id === country.c_id);
}
