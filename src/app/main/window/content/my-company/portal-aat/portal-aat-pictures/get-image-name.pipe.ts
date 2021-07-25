import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getImageName'
})

export class GetImageNamePipe implements PipeTransform {
  transform(rowName: string): string {
    return rowName.substring(rowName.indexOf('_') + 1);
  }
}

