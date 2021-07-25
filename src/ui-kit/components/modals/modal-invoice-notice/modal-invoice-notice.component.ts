import { CompanyDetails } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { InvoiceStatus } from '@/ui-kit/components/modals/modal-invoice-notice/models';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

const loadingIdentifier = 'INVOICE-NOTICE-MODAL';

@Component({
  selector: 'app-modal-invoice-notice',
  templateUrl: './modal-invoice-notice.component.html',
  styleUrls: ['./modal-invoice-notice.component.scss'],
})
export class ModalInvoiceNoticeComponent implements AfterViewInit {
  @Output() cancel = new EventEmitter();

  public companyDetails: CompanyDetails;
  public invoiceStatus: InvoiceStatus;
  public closeAfterXSeconds: number;
  public timer: number;
  public disableClose: boolean = true;
  public hideCloseButton: boolean = false;

  public attentionText: string;
  public salutationText: string;
  public noticeText: SafeHtml;
  public isLoading: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    public loaderService: LoaderService,
    public activeModal: NgbActiveModal,
  ) {
    this.isLoading = this.loaderService.isLoading(loadingIdentifier);
  }

  @Loading(loadingIdentifier)
  private async setTexts() {
    await this.translate.get([
      'modal.invoice' + this.invoiceStatus + 'NoticeText.text',
      'modal.invoice' + this.invoiceStatus + 'NoticeAttention.text',
      'modal.invoice' + this.invoiceStatus + 'NoticeSalutation.text'
    ]).toPromise().then((translations) => {
      this.noticeText = this.sanitizer.bypassSecurityTrustHtml(translations['modal.invoice' + this.invoiceStatus + 'NoticeText.text']);
      this.attentionText = translations['modal.invoice' + this.invoiceStatus + 'NoticeAttention.text'];
      this.salutationText = translations['modal.invoice' + this.invoiceStatus + 'NoticeSalutation.text'];
    });
  }

  init(invoiceStatus: InvoiceStatus, closeAfterXSeconds: number) {
    this.closeAfterXSeconds = closeAfterXSeconds;
    this.invoiceStatus = invoiceStatus;
    this.setTexts().catch();
  }

  ngAfterViewInit() {
    this.StartTimer();
  }

  StartTimer(){
    this.timer = window.setTimeout(() => {
      // if (this.closeAfterXSeconds <= 0) {
      //   return;
      // }
      this.closeAfterXSeconds -= 1;
      if (this.closeAfterXSeconds > 0) {
        this.StartTimer();
      } else {
        this.disableClose = false;
      }
    }, 1000);
  }
}
