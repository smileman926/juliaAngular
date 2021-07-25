import { Pipe, PipeTransform } from '@angular/core';

import { PersonPricingEntity, PricingPrices } from '../../../models';
import { PricesMainTabService } from '../prices-main-tab.service';

@Pipe({
  name: 'filterPrices'
})
export class FilterPricesPipe implements PipeTransform {

  constructor(private pricesMainTabService: PricesMainTabService) {}

  transform(prices: PricingPrices, minPersons: number, maxPersons: number): PricingPrices {
    const filteredPrices: PricingPrices = {};
    Object.keys(prices).filter(key => prices.hasOwnProperty(key)).forEach(key => {
      if (prices[key].length === 0) {
        return;
      }
      const samplePrices: PersonPricingEntity = prices[key][0];
      const filteredPricesEntities: PersonPricingEntity[] = [];
      for (let i = minPersons; i <= maxPersons; i++) {
        const existingEntity = prices[key].find(pricingEntity => pricingEntity.personsNo === i);
        if (existingEntity) {
          filteredPricesEntities.push(existingEntity);
        } else {
          const newEntity = this.pricesMainTabService.createPersonPricingEntity(i, samplePrices.typeId, samplePrices.seasonPeriodEntityId);
          filteredPricesEntities.push(newEntity);
        }
      }
      filteredPrices[key] = filteredPricesEntities;
    });
    return filteredPrices;
  }

}
