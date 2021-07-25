import { Pipe, PipeTransform } from '@angular/core';

import { Pricing, PricingSchemeType } from '../../../models';
import { isPricingSchemePercentBased } from '../../../utils';

export type AgeGroup = Pricing['ageGroups'][0];

@Pipe({
  name: 'ageGroupFormat',
})
export class AgeGroupFormatPipe implements PipeTransform {
  transform(discount: number, from: number, to: number, pricingSchemeType?: PricingSchemeType): string {
    const isPercentage = pricingSchemeType ? isPricingSchemePercentBased(pricingSchemeType) : true;
    const suffix = isPercentage ?  ' (' + discount + '%)' : '';
    if (from !== to) {
      return from + ' - ' + to + suffix;
    } else {
      return from + suffix;
    }
  }
}
