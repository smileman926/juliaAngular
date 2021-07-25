import { Pipe, PipeTransform } from '@angular/core';

import { PricingSchemeType } from '../../../models';

@Pipe({
  name: 'isPersonHighlighted'
})
export class IsPersonHighlightedPipe implements PipeTransform {

  transform(personsNumber: number, standardPrice: number, pricingSchemeType: PricingSchemeType): boolean {
    return personsNumber === standardPrice && pricingSchemeType !== PricingSchemeType.RoomLevel;
  }

}
