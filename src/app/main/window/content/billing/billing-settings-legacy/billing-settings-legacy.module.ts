import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { BillingSettingsLegacyComponent } from './billing-settings-legacy.component';

@NgModule({
  declarations: [BillingSettingsLegacyComponent],
  imports: [
    CommonModule,
    UIKitModule,
  ],
  entryComponents: [BillingSettingsLegacyComponent],
})
export class BillingSettingsLegacyModule { }
