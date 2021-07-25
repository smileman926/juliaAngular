import { Pipe, PipeTransform } from '@angular/core';

import { focusOnEnterMap } from '@/ui-kit/directives/focus-on-enter.directive';
import { ageGroupFocusOnEnterMap } from '../../../models';

@Pipe({
  name: 'getFocusOnEnterMap'
})
export class GetFocusOnEnterMapPipe implements PipeTransform {

  transform(map: ageGroupFocusOnEnterMap, id: symbol | undefined): focusOnEnterMap | undefined {
    if (!map) {
      return undefined;
    }
    const existingMap = map.get(id);
    if (existingMap) {
      return existingMap;
    }
    const newMap: focusOnEnterMap = new Map();
    map.set(id, newMap);
    return newMap;
  }

}
