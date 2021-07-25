import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageCalculated'
})
export class PercentageCalculatedPipe implements PipeTransform {

  transform(
    showAgeGroups: boolean,
    cateringOutOfRoomPrice: boolean,
    otherCateringRelative: boolean,
    displayPriceId: number | undefined,
    cateringTypeId: number | undefined
  ): boolean {
    if (!showAgeGroups) {
      return true;
    }
    return cateringOutOfRoomPrice && ((displayPriceId === cateringTypeId) || !otherCateringRelative);
  }

}
