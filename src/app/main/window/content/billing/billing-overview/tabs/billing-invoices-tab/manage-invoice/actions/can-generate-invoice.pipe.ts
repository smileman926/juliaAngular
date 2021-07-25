import { Pipe, PipeTransform } from '@angular/core';

import { VersionDetail } from '../models';

@Pipe({
  name: 'canGenerateInvoice'
})
export class CanGenerateInvoicePipe implements PipeTransform {

  transform(existingBillNo: boolean, versions: VersionDetail[], isInvoiceFormValid: boolean): boolean {
    return !existingBillNo && versions.length > 0 && isInvoiceFormValid;
  }

}
