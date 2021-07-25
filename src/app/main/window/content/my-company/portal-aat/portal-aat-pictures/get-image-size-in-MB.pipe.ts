import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getImageSizeInMB'
})

export class GetImageSizeInMBPipe implements PipeTransform {
  transform(rowSize: string): string {
    return (Math.round((Number(rowSize) / 1024 / 1024) * 100) / 100).toString() + 'MB';
  }
}

