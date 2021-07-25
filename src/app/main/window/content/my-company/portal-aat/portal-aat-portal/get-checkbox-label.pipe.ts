import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCheckBoxLabel'
})
export class GetCheckBoxLabelPipe implements PipeTransform  {
  transform(kind: string, type: string): string {
    if (!kind || !type) {
      return '';
    } else {
      return `ebc.portalAAT.${type}_${kind}.text`;
    }
  }
}
