import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@/app/auth/auth.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { stringifyDate } from '@/app/helpers/date';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';
import {
  BillVersionPaymentType,
  GuestPaymentBillVersionPaymentResult,
  SearchBookingForGuestPayment,
  SearchBookingForGuestPaymentResult } from '../models';
import { AddGuestPaymentsReceiveModalComponent } from './add-guest-payments-receive-modal/add-guest-payments-receive-modal.component';
import { PrintReceiptChoosingComponent } from './print-receipt-choosing/print-receipt-choosing.component';


@Component({
  selector: 'app-add-guest-payments-payments',
  templateUrl: './add-guest-payments-payments.component.pug',
  styleUrls: ['./add-guest-payments-payments.component.sass']
})
export class AddGuestPaymentsPaymentsComponent implements OnInit {

  form: FormGroup;
  isLoading: Observable<boolean>;
  searchSubject = new Subject<string>();
  searchBookingForGuestPayment: SearchBookingForGuestPayment;
  searchBookingForGuestPaymentResults: SearchBookingForGuestPaymentResult[];
  selectedBookingInvoice: SearchBookingForGuestPaymentResult | null;
  billVersionPaymentTypes: BillVersionPaymentType[];
  today: Date;
  isSavedBookInvoice: boolean;
  isSavedBookInvoiceStr: string;
  rcID: number;
  isHidePrintReceipt: boolean;
  isDisablePrintReceipt: boolean;

  constructor(
    private apiHotel: ApiHotelService,
    private authService: AuthService,
    private translateService: TranslateService,
    public loaderService: LoaderService,
    private modalService: ModalService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.searchBookingForGuestPaymentResults = [];
    this.billVersionPaymentTypes = [];
    this.today = new Date();
    this.isSavedBookInvoice = false;
    this.isSavedBookInvoiceStr = '';
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.billVersionPaymentTypes = await this.apiHotel.getBillVersionPaymentType().toPromise();
    this.initForm();
    (this.form.get('paymentMethod') as FormControl).valueChanges.subscribe( val => {
      if (this.billVersionPaymentTypes.find( l => l.bvpt_id === val )) {
        (this.form.get('isSpotPayment') as FormControl).setValue(
          this.billVersionPaymentTypes.filter( l => l.bvpt_id === val)[0].bvpt_isCreditCard === 'on'
        );
      }
    });
  }

  public initForm(): void {
    this.form = new FormGroup({
      searchStr: new FormControl('', Validators.required),
      paymentMethod: new FormControl('1'),
      paymentDate: new FormControl(this.today),
      description: new FormControl('', Validators.required),
      amount: new FormControl(0, Validators.required),
      isSpotPayment: new FormControl(false)
    });
  }

  public onSearchKeyUp(): void {
    this.searchBookingForGuestPaymentResults = [];
    this.selectedBookingInvoice = null;
    if (this.form) {
      this.searchSubject.next((this.form.get('searchStr') as FormControl).value);
    }
  }

  public async checkPayment(): Promise<void> {
    const creationDate = this.selectedBookingInvoice && this.selectedBookingInvoice.b_creationDate ?
      new Date(this.selectedBookingInvoice.b_creationDate) : null;
    const paymentDate = new Date((this.form.get('paymentDate') as FormControl).value);
    if (creationDate && paymentDate < creationDate) {
      const translation: string = await this.translateService.get('ebc.guestPayment.backdatedPaymentInfo.text').toPromise();
      const confirmed = await this.modalService.openConfirm(
        '',
        translation.replace('{{paymentDate}}', stringifyDate(new Date((this.form.get('paymentDate') as FormControl).value), false))
        .replace('<br>', ' \n'),
        {
          hideHeader: true,
          primaryButtonLabel: 'ebc.buttons.yes.text',
          secondaryButtonLabel: 'ebc.buttons.no.text',
        }
      );
      if (confirmed) {
        this.checkDepositReceivedEmail();
      }
    } else {
      this.checkDepositReceivedEmail();
    }
  }

  public async checkDepositReceivedEmail(): Promise<void> {
    if (this.selectedBookingInvoice) {
      const {modal, modalBody} = this.modalService.openForms(
        '',
        AddGuestPaymentsReceiveModalComponent,
        {
          hideHeader: true,
          primaryButtonLabel: 'ebc.buttons.send.text',
          secondaryButtonLabel: 'ebc.buttons.doNotSend.text',
        });
      modalBody.init('message', this.selectedBookingInvoice.c_eMailAddress);
      const { customerId, languageId } = this.authService.getQueryParams();
      const formVals = this.form.getRawValue();
      const obj = {
        b_id: this.selectedBookingInvoice.b_id,
        bill_id: this.selectedBookingInvoice.bill_id,
        bvp_amount: formVals.amount,
        bvp_billVersionPaymentType_id: Number(formVals.paymentMethod),
        bvp_desc: formVals.description,
        bvp_isLocalPayment: formVals.isSpotPayment ? 'on' : 'off',
        bvp_paymentDate: stringifyDate(new Date((this.form.get('paymentDate') as FormControl).value), false),
        cId: this.selectedBookingInvoice.c_id,
        customerId,
        localeId: languageId,
        paymentCount: this.selectedBookingInvoice.paymentCount,
        sendEMail: 'off',
        customerEMailAddress: ''
      };
      modal.save.subscribe( async () => {
        const result = await modalBody.save();
        if (result.status) {
          modal.close(true);
          obj.sendEMail = 'on';
          obj.customerEMailAddress = result.email;
          await this.saveBookInvoice(obj);
        }
      });
      modalBody.cancel.subscribe(() => {
        setTimeout(async () => {
          if (obj.sendEMail === 'off') {
            await this.saveBookInvoice(obj);
          }
        }, 500);
      });
    }
  }

  @Loading(LoaderType.LOAD)
  public async saveBookInvoice(body): Promise<void> {
    const res = await this.apiHotel.postGuestPaymentBillVersionPayment(body).toPromise();
    if (res) {
      this.rcID = Number(res.rc_id);
      this.showReceiptAndInvoice(res);
    }
  }

  @Loading(LoaderType.LOAD)
  public async openInvoice(): Promise<void> {
    if (this.selectedBookingInvoice) {
      const resURL = await this.apiHotel.getBillingInvoicePDF(
        Number(this.selectedBookingInvoice.bill_id),
        Number(this.selectedBookingInvoice.b_id)).toPromise();
      if (resURL.length > 0) {
        redirectWithPOST(
          getUrl(resURL[0]),
          {}
        );
      }
    }
  }

  // @Loading(LoaderType.LOAD)
  public async printReceipt(): Promise<void> {
    const { modal, modalBody } = await this.modalService.openBorderless(PrintReceiptChoosingComponent);
    modalBody.init(this.rcID);
  }

  public async showReceiptAndInvoice(result: GuestPaymentBillVersionPaymentResult): Promise<void> {
    const str = await this.translateService.get('ebc.guestPayment.paymentAddedMessage.text').toPromise();
    this.isSavedBookInvoiceStr = str.replace(
        '{{bookingNo}}', this.selectedBookingInvoice ? this.selectedBookingInvoice.b_bookingNo ?
        this.selectedBookingInvoice.b_bookingNo : this.selectedBookingInvoice.b_billNo : ''
      ).replace(
        '{{paymentMethod}}',
        this.billVersionPaymentTypes.filter( l => l.bvpt_id === (this.form.get('paymentMethod') as FormControl).value)[0].bvptl_name
      ).replace(
        '{{amount}}', Math.round(Number((this.form.get('amount') as FormControl).value) * 100) / 100
      );
    this.isHidePrintReceipt = Number(result.rc_id) === 0;
    this.isDisablePrintReceipt = result.rc_sendState === 'sending';
    this.isSavedBookInvoice = true;
  }

  public async selectBookingInvoice(item: SearchBookingForGuestPaymentResult): Promise<void> {
    this.selectedBookingInvoice = item;
    let itemName = item.b_billNo.length > 0 ? item.b_billNo :
      (item.billSum !== null ? await this.translateService.get('ebc.guestPayment.standaloneInvoiceName.text').toPromise()
        + '' + Math.round(Number(item.billSum) * 100) / 100 : item.b_bookingNo);
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
    (this.form.get('searchStr') as FormControl).setValue(itemName);
  }

  public async searchInvoice(): Promise<void> {
    const { searchStr } = this.form.getRawValue();
    const formData = new FormData();
    formData.append('searchValue', searchStr);
    this.searchBookingForGuestPayment = await this.apiHotel.postSearchBookingForGuestPayment(formData).toPromise();
    this.searchBookingForGuestPaymentResults = this.searchBookingForGuestPayment.result;
  }

  ngOnInit(): void {
    this.init();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.searchInvoice();
    });
  }

}
