import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { EnquiryPoolSettingsComponent } from './enquiry-pool-settings.component';
import { EnquiryPoopSettingsGeneralComponent } from './enquiry-poop-settings-general/enquiry-poop-settings-general.component';

@NgModule({
  declarations: [EnquiryPoolSettingsComponent, EnquiryPoopSettingsGeneralComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    HttpModule.forRoot()
  ],
  entryComponents: [EnquiryPoolSettingsComponent]
})
export class EnquiryPoolSettingsModule { }
