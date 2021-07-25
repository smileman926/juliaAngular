import { QuillModule } from 'ngx-quill';
import { UiSwitchModule } from 'ngx-ui-switch';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';

import { AddPaymentTypeComponent } from './add-payment-type/add-payment-type.component';
import { PaymentAdditionalTypesComponent } from './payment-additional-types/payment-additional-types.component';
import { PaymentBankTransferComponent } from './payment-bank-transfer/payment-bank-transfer.component';
import { PaymentCreditCardComponent } from './payment-credit-card/payment-credit-card.component';
import { PaymentGeneralComponent } from './payment-general/payment-general.component';
import { PaymentHobexComponent } from './payment-hobex/payment-hobex.component';
import { PaymentPaypalComponent } from './payment-paypal/payment-paypal.component';
import { PaymentSofortComponent } from './payment-sofort/payment-sofort.component';
import { PaymentComponent } from './payment.component';
import { IsCountryActivatedPipe } from './set-payment-country/is-country-activated.pipe';
import { SetPaymentCountryComponent } from './set-payment-country/set-payment-country.component';
import { TextTranslateComponent } from './text-translate/text-translate.component';

@NgModule({
  declarations: [
    PaymentAdditionalTypesComponent,
    PaymentComponent,
    PaymentGeneralComponent,
    PaymentBankTransferComponent,
    PaymentCreditCardComponent,
    PaymentPaypalComponent,
    PaymentSofortComponent,
    TextTranslateComponent,
    SetPaymentCountryComponent,
    AddPaymentTypeComponent,
    IsCountryActivatedPipe,
    PaymentHobexComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    HttpModule.forRoot(),
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgbTooltipModule
  ],
  entryComponents: [PaymentComponent, TextTranslateComponent, SetPaymentCountryComponent, AddPaymentTypeComponent]
})
export class PaymentModule { }
