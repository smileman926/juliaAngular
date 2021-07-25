import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SearchBookingForGuestPaymentResult } from '../models';

@Pipe({
  name: 'getBookInvoiceLabel'
})
export class GetBookInvoiceLabelPipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  public async getFromTranslateService(): Promise<string> {
    return await this.translateService.get('ebc.guestPayment.standaloneInvoiceName.text').toPromise();
  }

  transform(item: SearchBookingForGuestPaymentResult): string {
    const standaloneInvoiceName = this.getFromTranslateService();
    let itemName = item.b_billNo.length > 0 ? item.b_billNo :
      (item.billSum !== null ? standaloneInvoiceName + '' + Math.round(Number(item.billSum) * 100) / 100 : item.b_bookingNo);
    let billName = '';
    if (item.c_firstName) {
      billName = item.c_firstName;
      if (item.c_lastName) {
        billName += ' ';
      }
    }
    if (item.c_lastName) {
      billName += item.c_lastName;
    }
    if (billName) {
      itemName += ' - ' + billName;
    }
    return itemName;
  }

}
