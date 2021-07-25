import { Pipe, PipeTransform } from '@angular/core';

import { AddingProductGroup } from '../models';

@Pipe({
  name: 'getAddingProductGroupLabel'
})
export class GetAddingProductGroupNamePipe implements PipeTransform {

  constructor() {}

  transform(item: AddingProductGroup): string {
    return item.pgl_name && item.pgl_name.length > 0 ? item.pgl_name : item.pg_name;
  }
}
