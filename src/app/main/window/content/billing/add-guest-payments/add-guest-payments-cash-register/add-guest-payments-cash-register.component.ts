import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '@/app/auth/auth.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import {
  AddGuestPaymentsReceiveModalComponent
} from '../add-guest-payments-payments/add-guest-payments-receive-modal/add-guest-payments-receive-modal.component';
import { PrintReceiptChoosingComponent } from '../add-guest-payments-payments/print-receipt-choosing/print-receipt-choosing.component';
import { LoaderType } from '../loader-types';
import { BillVersionPaymentType, RCIInfo } from '../models';
import { CashRegisterAddProductModalComponent } from './cash-register-add-product-modal/cash-register-add-product-modal.component';

@Component({
  selector: 'app-add-guest-payments-cash-register',
  templateUrl: './add-guest-payments-cash-register.component.pug',
  styleUrls: ['./add-guest-payments-cash-register.component.sass']
})
export class AddGuestPaymentsCashRegisterComponent implements OnInit {

  public form: FormGroup;
  public isLoading: Observable<boolean>;
  public billVersionPaymentTypes: BillVersionPaymentType[];
  public isInvalidCreateReceipt: boolean;
  public secondPMActive: boolean;
  public adjustValuesTimeoutId: ReturnType<typeof setTimeout>;
  public totalGross: number;
  public totalTax: number;
  public lastProductGroupId: number | string;
  public lastSavedReceipt: { [field: string]: string | number | Date };
  public receiptMdl: { [field: string]: string | number | Date };
  public receiptItems: RCIInfo[];
  public receiptPayment: { [field: string]: string | number | Date };
  public receipt2ndPayment: { [field: string]: string | number | Date };
  public receiptSignature: { [field: string]: string | number | Date | null };
  public receiptId: string;
  public creationDate: string;
  public billVersionPaymentType: string;
  public billVersionPaymentType2: string;
  public receiptCreatedMessage: string;

  constructor(
    private apiHotel: ApiHotelService,
    private authService: AuthService,
    private translateService: TranslateService,
    public loaderService: LoaderService,
    private modalService: ModalService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.billVersionPaymentTypes = [];
    this.isInvalidCreateReceipt = true;
    this.lastProductGroupId = 0;
    this.lastSavedReceipt = {
      rc_id: 0,
      rc_receiptNo: '',
      rc_creationDate: '',
      rc_billVersionPaymentType_id: 0,
      rc_2ndBillVersionPaymentType_id: 0,
      rc_amount: 0,
      rc_2ndAmount: 0
    };
    this.initialize();
  }

  public initialize(): void {
    this.totalGross = 0;
    this.secondPMActive = false;
    this.receiptItems = [];
    const { customerId, languageId } = this.authService.getQueryParams();
    this.receiptMdl = {
      customerId,
      localeId: languageId,
      rc_totalGross: 0,
      rc_totalNet: 0,
      rc_totalTax: 0,
      rc_creationDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    this.receiptPayment = {
      customerId,
      localeId: languageId,
      rcp_billVersionPaymentType_id: 0,
      rcp_amount: 0,
      rcp_receipt_id: ''
    };
    this.receipt2ndPayment = {
      customerId,
      localeId: languageId,
      rcp_billVersionPaymentType_id: 0,
      rcp_amount: 0,
      rcp_receipt_id: ''
    };
  }

  public async initReceiptInfo(): Promise<void> {
    this.receiptId = this.lastSavedReceipt.rc_receiptNo.toString();
    this.creationDate = dayjs(this.lastSavedReceipt.rc_creationDate).format('YYYY-MM-DD HH:mm:ss');
    const tempType = this.billVersionPaymentTypes.find(l => l.bvpt_id === this.lastSavedReceipt.rc_billVersionPaymentType_id);
    if (tempType) {
      this.billVersionPaymentType = tempType.bvptl_name;
      this.billVersionPaymentType += ' (' + Number(this.lastSavedReceipt.rc_amount).toFixed(2) + ')';
    }
    if ( this.lastSavedReceipt.rc_2ndBillVersionPaymentType_id > 0 ) {
      const tempType2 = this.billVersionPaymentTypes.find(l => l.bvpt_id === this.lastSavedReceipt.rc_2ndBillVersionPaymentType_id);
      if (tempType2) {
          this.billVersionPaymentType2 = tempType2.bvptl_name;
          this.billVersionPaymentType2 += ' (' + Number(this.lastSavedReceipt.rc_2ndAmount).toFixed(2) + ')';
      }
    }
    const str = await this.translateService.get('ebc.guestPayment.receiptCreatedMessage.text').toPromise();
    this.receiptCreatedMessage = str.replace('{receiptNo}', this.receiptId);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const res = await this.apiHotel.getBillVersionPaymentType().toPromise();
    if (res.length > 0) {
      this.billVersionPaymentTypes = res.filter( item => item.bvpt_isCashPayment === 'on');
    }
    this.form = new FormGroup({
      GPCR_billVersionPaymentType: new FormControl('choose'),
      GPCR_value: new FormControl(0),
      GPCR_2ndBillVersionPaymentType: new FormControl('choose'),
      GPCR_2ndValue: new FormControl(0),
    });
    this.initTotalGrossAndTax();

    (this.form.get('GPCR_billVersionPaymentType') as FormControl).valueChanges.pipe(distinctUntilChanged()).subscribe( val => {
      this.setPM(val, 1);
    });
    (this.form.get('GPCR_2ndBillVersionPaymentType') as FormControl).valueChanges.pipe(distinctUntilChanged()).subscribe( val => {
      this.setPM(val, 2);
    });
  }

  public initTotalGrossAndTax(): void {
    this.totalGross = 0;
    this.totalTax = 0;
    this.receiptItems.map( item => {
      this.totalGross += Number(item.rci_totalGross);
      this.totalTax += Number(item.rci_totalTax);
    });
  }

  public initBillVersionPaymentType(): void {
    (this.form.get('GPCR_billVersionPaymentType') as FormControl).setValue(
      this.receiptPayment.rcp_billVersionPaymentType_id ? this.receiptPayment.rcp_billVersionPaymentType_id
      : 'choose'
    );
    (this.form.get('GPCR_value') as FormControl).setValue(this.receiptPayment.rcp_amount ? this.receiptPayment.rcp_amount : 0);

    (this.form.get('GPCR_2ndBillVersionPaymentType') as FormControl).setValue(
      this.receipt2ndPayment.rcp_billVersionPaymentType_id ? this.receipt2ndPayment.rcp_billVersionPaymentType_id
      : 'choose'
    );
    (this.form.get('GPCR_2ndValue') as FormControl).setValue(this.receipt2ndPayment.rcp_amount ? this.receipt2ndPayment.rcp_amount : 0);
  }

  public setPM(val: string, index: number): void {
    const rcp = index === 1 ? this.receiptPayment : this.receipt2ndPayment;
    rcp.rcp_billVersionPaymentType_id = val;
    this.checkIfSaveBtnHasToBeActive();
  }

  public show2ndPM(): void {
    this.secondPMActive = true;
    this.initTotalGrossAndTax();
    this.initBillVersionPaymentType();
    this.checkIfSaveBtnHasToBeActive();
  }

  public adjustPMValues(index: number, notHuman?: boolean): void {
    clearTimeout(this.adjustValuesTimeoutId);
    this.adjustValuesTimeoutId = setTimeout(() => {

      const val = index === 1 ? (this.form.get('GPCR_value') as FormControl).value :
      (this.form.get('GPCR_2ndValue') as FormControl).value;

      let srcVal = val;
      if (val > this.totalGross || this.totalGross === 0) {
        srcVal = this.totalGross;
      }

      if (!this.secondPMActive && srcVal < this.totalGross) {
        if (notHuman) {
          srcVal = this.totalGross;
        } else {
          this.secondPMActive = true;
          this.show2ndPM();
        }
      }

      if (index === 1) {
        (this.form.get('GPCR_value') as FormControl).setValue(srcVal);
        (this.form.get('GPCR_2ndValue') as FormControl).setValue(this.totalGross - srcVal);
      } else {
        (this.form.get('GPCR_2ndValue') as FormControl).setValue(srcVal);
        (this.form.get('GPCR_value') as FormControl).setValue(this.totalGross - srcVal);
      }

      this.receiptPayment.rcp_amount = (this.form.get('GPCR_value') as FormControl).value;
      if (this.secondPMActive) {
        this.receipt2ndPayment.rcp_amount = (this.form.get('GPCR_2ndValue') as FormControl).value;
      }

      this.checkIfSaveBtnHasToBeActive();
    }, 500);
  }

  public checkIfSaveBtnHasToBeActive(): boolean {
    // check if we have to enable the save button
    // first check if the amount are equal to totalGross;
    // then check if the paymentMethods are choosen if the amount is > 0

    if (this.receiptItems.length > 0) {
      const amount1 = Number(this.receiptPayment.rcp_amount);
      const amount2 = this.secondPMActive ? Number(this.receipt2ndPayment.rcp_amount) : 0;
      let enableSBtn = (amount1 + amount2).toFixed(2) === this.totalGross.toFixed(2);

      if (enableSBtn) {
        // 2nd check are the paymentMethods
        if (this.receiptPayment.rcp_billVersionPaymentType_id === 'choose'
          || !this.receiptPayment.rcp_billVersionPaymentType_id) {
          enableSBtn = false;
        } else if (this.secondPMActive &&
          (this.receipt2ndPayment.rcp_billVersionPaymentType_id === 'choose' ||
            !this.receiptPayment.rcp_billVersionPaymentType_id)) {
          // we only have to check the 2nd one if the first one is set correct and the 2nd is active
          enableSBtn = false;
        }
      }

      if (enableSBtn === true) {
        this.isInvalidCreateReceipt = false;
        return true;
      } else {
        this.isInvalidCreateReceipt = true;
        return false;
      }
    } else {
      this.isInvalidCreateReceipt = true;
      return false;
    }
  }

  public async openProductModal(item?: RCIInfo): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms(
      'ebc.buttons.addProduct.text',
      CashRegisterAddProductModalComponent,
      {
        primaryButtonLabel: 'ebc.buttons.save.text'
      }
    );
    if (item) {
      modalBody.init({
        item,
        index: this.receiptItems.indexOf(item),
        lpgId: this.lastProductGroupId
      });
    } else {
      modalBody.init();
    }
    modal.save.subscribe( async () => {
      const result = await modalBody.save();
      if (result.status) {
        modal.close(true);
        if (result.isEdit) {
          this.receiptItems[result.index] = result.obj;
        } else {
          this.lastProductGroupId = result.lastProductGroup_id;
          this.lastSavedReceipt = result.lastSavedReceipt;
          this.receiptItems.push(result.obj);
        }
        this.initTotalGrossAndTax();
        this.initBillVersionPaymentType();
        if (this.secondPMActive) {
          this.adjustPMValues(2, true);
        } else {
          this.adjustPMValues(1, true);
        }
      }
    });
  }

  public deleteProduct(item): void {
    this.receiptItems.splice(this.receiptItems.indexOf(item), 1);
    this.initTotalGrossAndTax();
    this.initBillVersionPaymentType();
    if (this.secondPMActive) {
      this.adjustPMValues(2);
    } else {
      this.adjustPMValues(1);
    }
  }

  @Loading(LoaderType.LOAD)
  public async saveReceipt(): Promise<void> {

    if (this.receiptItems.length < 1 || !this.checkIfSaveBtnHasToBeActive()) {
      return;
    }

    // We need to do following steps:
    // 1. save receipt
    // 2. save receiptItems with receipt_id set
    // 3. save receiptPayments with receipt_id set

    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;

    this.receiptItems.map( l => {
      totalGross += Number(l.rci_totalGross);
      totalTax += Number(l.rci_totalTax);
      totalNet += Number(l.rci_totalNet);
    });

    this.receiptMdl.rc_totalGross = totalGross;
    this.receiptMdl.rc_totalTax = totalTax;
    this.receiptMdl.rc_totalNet = totalNet;

    // this.setCreationDate();

    // calculate the amount of saves... receipt + length of items + payment + if active payment 2
    let cntSavingMdls = 1 + this.receiptItems.length + (this.secondPMActive && this.receipt2ndPayment.rcp_amount > 0 ? 2 : 1);
    if (this.receipt2ndPayment.rcp_amount <= 0) {
      this.secondPMActive = false;
    }
    const res = await this.apiHotel.postReceipt(this.receiptMdl).toPromise();
    if (res) {
      cntSavingMdls--;

      // if we saved the receipt proceed to step 2
      await Promise.all(
        this.receiptItems.map(async l => {
          l.rci_receipt_id = res.rc_id;
          const subRes = await this.apiHotel.postReceiptItem(l).toPromise();
          if (subRes) {
            cntSavingMdls--;
            if (cntSavingMdls === 0) {
              this.afterSave(res.rc_id, res.rc_receiptNo, res.rc_creationDate);
            }
          }
        }),
      );

      this.receiptPayment.rcp_receipt_id = res.rc_id;
      const subRes2 = await this.apiHotel.postReceiptPayment(this.receiptPayment).toPromise();
      if (subRes2) {
        cntSavingMdls--;
        if (cntSavingMdls === 0) {
          this.afterSave(res.rc_id, res.rc_receiptNo, res.rc_creationDate);
        }
      }

      if (this.secondPMActive && this.receipt2ndPayment.rcp_amount > 0) {
        this.receipt2ndPayment.rcp_receipt_id = res.rc_id;
        const subRes3 = await this.apiHotel.postReceiptPayment(this.receipt2ndPayment).toPromise();
        if (subRes3) {
          cntSavingMdls--;
          if (cntSavingMdls === 0) {
            this.afterSave(res.rc_id, res.rc_receiptNo, res.rc_creationDate);
          }
        }
      }
    }
  }

  @Loading(LoaderType.LOAD)
  public async afterSave(rcId: string, rcReceiptNo: string, rcCreationDate: Date | string): Promise<void> {
    // after all inserted, we need to start the signature process
    const { customerId, languageId } = this.authService.getQueryParams();
    this.receiptSignature = {
      customerId,
      localeId: languageId,
      rc_id: 0,
      rc_sendState: null
    };
    this.receiptSignature.rc_id = rcId;
    const res = await this.apiHotel.putReceiptSignature(this.receiptSignature).toPromise();
    if (res) {
      // after the save, we have to re-init the form and render it new
      this.lastSavedReceipt.rc_id = rcId;
      this.lastSavedReceipt.rc_receiptNo = rcReceiptNo;
      this.lastSavedReceipt.rc_creationDate = rcCreationDate;
      this.lastSavedReceipt.rc_billVersionPaymentType_id = this.receiptPayment.rcp_billVersionPaymentType_id;
      this.lastSavedReceipt.rc_amount = this.receiptPayment.rcp_amount;
      this.lastSavedReceipt.rc_2ndBillVersionPaymentType_id = this.secondPMActive && this.receipt2ndPayment.rcp_amount > 0 ?
        this.receipt2ndPayment.rcp_billVersionPaymentType_id : 0;
      this.lastSavedReceipt.rc_2ndAmount = this.receipt2ndPayment.rcp_amount;
      this.initialize();
      this.initTotalGrossAndTax();
      this.initBillVersionPaymentType();
      this.initReceiptInfo();
    }
  }

  public async printReceipt(): Promise<void> {
    const { modal, modalBody } = await this.modalService.openBorderless(PrintReceiptChoosingComponent);
    modalBody.init(Number(this.lastSavedReceipt.rc_id));
  }

  public async sendReceipt(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms(
      '',
      AddGuestPaymentsReceiveModalComponent,
      {
        hideHeader: true,
        primaryButtonLabel: 'ebc.buttons.send.text',
        secondaryButtonLabel: 'ebc.buttons.doNotSend.text',
      });
    modalBody.init('receipt');
    modal.save.subscribe( async () => {
      const result = await modalBody.save();
      if (result.status) {
        modal.close(true);
        this.sendReceiptToEmail(result.email);
      }
    });
  }

  @Loading(LoaderType.LOAD)
  public async sendReceiptToEmail(email: string) {
    await this.apiHotel.sendReceipt(Number(this.receiptSignature.rc_id), email).toPromise();
  }
  ngOnInit(): void {
    this.init();
  }

}
