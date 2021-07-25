import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { AddGuestPaymentsLegacyComponent } from './add-guest-payments-legacy.component';

@NgModule({
  declarations: [AddGuestPaymentsLegacyComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [AddGuestPaymentsLegacyComponent]

})
export class AddGuestPaymentsLegacyModule {
}
