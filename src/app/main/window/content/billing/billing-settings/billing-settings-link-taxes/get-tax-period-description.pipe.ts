import { Pipe, PipeTransform } from '@angular/core';

import { stringifyDate } from '@/app/helpers/date';
import { TaxPeriodModel } from '../model';

@Pipe({
  name: 'getTaxPeriodDescription'
})
export class GetTaxPeriodDescriptionPipe implements PipeTransform {

  constructor() { }

  transform(item: TaxPeriodModel, swapStr: string): string {
    return item.tp_description.replace(/Kopie/g, swapStr) + ' | ' + stringifyDate(item.tp_from) + ' - ' + stringifyDate(item.tp_until);
  }
}
