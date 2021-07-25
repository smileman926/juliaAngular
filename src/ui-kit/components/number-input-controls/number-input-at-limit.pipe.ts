import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberInputAtLimit'
})
export class NumberInputAtLimitPipe implements PipeTransform {

  transform(value?: number, limit?: number): boolean {
    if (value === undefined || limit === undefined || !Number.isFinite(limit)) {
      return false;
    }
    return value === limit;
  }

}
