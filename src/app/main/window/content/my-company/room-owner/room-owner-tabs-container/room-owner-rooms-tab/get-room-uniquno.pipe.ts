import { Pipe, PipeTransform } from '@angular/core';

import { EntityInfo } from '../../models';

@Pipe({
  name: 'getRoomNo'
})
export class GetRoomNoPipe implements PipeTransform  {
  transform(id: string, entityList: EntityInfo[]): string {
    if (!entityList) {
      return '';
    } else {
      const sameEntity = entityList.find( item => item.e_id === id);
      if ( sameEntity ) {
        return sameEntity.e_uniqueNo;
      } else {
        return '';
      }
    }
  }
}
