import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterActive'
})
export class FilterActivePipe implements PipeTransform {

  transform<T extends {active: boolean}>(items: T[]): T[] {
    if (!items) {
      return [];
    }
    return items.filter(item => item.active);
  }

}
