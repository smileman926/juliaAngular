import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../../shared/table/table.module';
import { AddGuestPaymentsCashRegisterComponent } from './add-guest-payments-cash-register/add-guest-payments-cash-register.component';
import {
  CashRegisterAddProductModalComponent
} from './add-guest-payments-cash-register/cash-register-add-product-modal/cash-register-add-product-modal.component';
import { GetAddingProductGroupNamePipe } from './add-guest-payments-cash-register/get-adding-product-group-name.pipe';
import { AddGuestPaymentsPaymentsComponent } from './add-guest-payments-payments/add-guest-payments-payments.component';
import {
  AddGuestPaymentsReceiveModalComponent
} from './add-guest-payments-payments/add-guest-payments-receive-modal/add-guest-payments-receive-modal.component';
import { GetBookInvoiceLabelPipe } from './add-guest-payments-payments/get-book-invoice-label.pipe';
import { PrintReceiptChoosingComponent } from './add-guest-payments-payments/print-receipt-choosing/print-receipt-choosing.component';
import { AddGuestPaymentsComponent } from './add-guest-payments.component';

@NgModule({
  declarations: [
    AddGuestPaymentsComponent,
    AddGuestPaymentsPaymentsComponent,
    AddGuestPaymentsCashRegisterComponent,
    AddGuestPaymentsReceiveModalComponent,
    GetBookInvoiceLabelPipe,
    GetAddingProductGroupNamePipe,
    PrintReceiptChoosingComponent,
    CashRegisterAddProductModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    TableModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    HttpModule.forRoot(),
    NgbTooltipModule
  ],
  entryComponents: [
    AddGuestPaymentsComponent,
    AddGuestPaymentsReceiveModalComponent,
    PrintReceiptChoosingComponent,
    CashRegisterAddProductModalComponent
  ]
})
export class AddGuestPaymentsModule { }
