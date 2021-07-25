import { Pipe, PipeTransform } from '@angular/core';

import { FormOption } from '@/app/main/shared/form-data.service';
import { PricingSchemeType } from '../../../models';
import { getPricingSchemeType } from '../../../utils';

@Pipe({
  name: 'getPricingSchemeType'
})
export class GetPricingSchemeTypePipe implements PipeTransform {

  transform(pricingSchemeId: number, pricingSchemes: FormOption[]): PricingSchemeType | undefined {
    return getPricingSchemeType(pricingSchemeId, pricingSchemes);
  }

}
