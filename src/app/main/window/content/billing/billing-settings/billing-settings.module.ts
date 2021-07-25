import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';

import { SettingsComponent } from './billing-settings.component';

import { AddBillingTaxComponent } from './add-billing-tax/add-billing-tax.component';
import { BillingSettingsCashRegisterComponent } from './billing-settings-cash-register/billing-settings-cash-register.component';
import { BillingSettingsGeneralComponent } from './billing-settings-general/billing-settings-general.component';
import { BillingSettingsInvoiceAddressComponent } from './billing-settings-invoice-address/billing-settings-invoice-address.component';
import { BillingSettingsInvoiceItemComponent } from './billing-settings-invoice-item/billing-settings-invoice-item.component';
import { BillingSettingsLayoutComponent } from './billing-settings-layout/billing-settings-layout.component';
import { BillingSettingsLinkTaxesComponent } from './billing-settings-link-taxes/billing-settings-link-taxes.component';
import { GetTaxPeriodDescriptionPipe } from './billing-settings-link-taxes/get-tax-period-description.pipe';
import { BillingSettingsTaxesComponent } from './billing-settings-taxes/billing-settings-taxes.component';
import { TaxChangeHintModalComponent } from './tax-change-hint-modal/tax-change-hint-modal.component';
import { TaxPeriodsModalComponent } from './tax-periods-modal/tax-periods-modal.component';
import { TextTranslateComponent } from './text-translate/text-translate.component';

@NgModule({
  declarations: [
    SettingsComponent,
    BillingSettingsGeneralComponent,
    BillingSettingsLayoutComponent,
    BillingSettingsInvoiceItemComponent,
    BillingSettingsTaxesComponent,
    BillingSettingsLinkTaxesComponent,
    BillingSettingsInvoiceAddressComponent,
    BillingSettingsCashRegisterComponent,
    TextTranslateComponent,
    AddBillingTaxComponent,
    TaxPeriodsModalComponent,
    TaxChangeHintModalComponent,
    GetTaxPeriodDescriptionPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    HttpModule.forRoot(),
    NgbTooltipModule,
    NgbPopoverModule,
  ],
  entryComponents: [
    SettingsComponent,
    TextTranslateComponent,
    AddBillingTaxComponent,
    TaxPeriodsModalComponent,
    TaxChangeHintModalComponent]
})
export class BillingSettingsModule { }
