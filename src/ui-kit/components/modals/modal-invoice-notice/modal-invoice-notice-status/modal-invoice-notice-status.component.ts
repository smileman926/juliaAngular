import { ViewService } from '@/app/main/view/view.service';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { InvoiceStatus } from '@/ui-kit/components/modals/modal-invoice-notice/models';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-invoice-notice-status',
  templateUrl: './modal-invoice-notice-status.component.html',
  styleUrls: ['./modal-invoice-notice-status.component.scss']
})
export class ModalInvoiceNoticeStatusComponent implements AfterViewInit {
  @Output() cancel = new EventEmitter();

  @Input() attentionText: string;
  @Input() salutationText: string;
  @Input() noticeText: SafeHtml;
  @Input() invoiceStatus: InvoiceStatus;
  @Input() closeAfterXSeconds: number;
  @Input() disableClose: boolean;
  @Input() hideCloseButton: boolean;

  InvoiceStatus = InvoiceStatus;

  constructor(
    private viewService: ViewService
  ) { }

  openMyEBWindow() {
    openSupportForm(this.viewService, { overModal: this.invoiceStatus === InvoiceStatus.LAWSUIT });
  }

  openSugarInvoicesWindow() {
    this.viewService.openViewById('myAccount');
  }

  ngAfterViewInit() {
    const myEbRef = document.getElementById('openMyEB');
    const sugarInvoicesRef = document.getElementById('openSugarInvoices');
    if (myEbRef) {
      myEbRef.addEventListener('click', () => {
        this.openMyEBWindow();
      });
    }
    if (sugarInvoicesRef) {
      sugarInvoicesRef.addEventListener('click', () => {
        this.openSugarInvoicesWindow();
      });
    }
  }

}
