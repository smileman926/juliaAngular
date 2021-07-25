import { Pipe, PipeTransform } from '@angular/core';

import { CateringEntity } from '@/app/main/window/shared/pricing-settings/models';
import { PricesMainTabService } from '../prices-main-tab.service';

@Pipe({
  name: 'cateringName'
})
export class CateringNamePipe implements PipeTransform {

  constructor(private pricesMainTabService: PricesMainTabService) {}

  transform(catering: CateringEntity): string {
    if (!this.pricesMainTabService.cateringTypes) {
      return '';
    }
    const cateringType = this.pricesMainTabService.cateringTypes.find(type => type.id === catering.typeId);
    return cateringType ? cateringType.name : '';
  }

}
