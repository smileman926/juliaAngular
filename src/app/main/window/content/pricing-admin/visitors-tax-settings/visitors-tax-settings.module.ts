import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';

import { MainSharedModule } from '@/app/main/main-shared.module';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { TaxDetailComponent } from './tax-detail/tax-detail.component';
import { VisitorsTaxSettingsComponent } from './visitors-tax-settings.component';

@NgModule({
  declarations: [VisitorsTaxSettingsComponent, GeneralSettingsComponent, TaxDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    MainSharedModule,
    ReactiveFormsModule,
    HttpModule.forRoot(),
    NgbTooltipModule,
  ],
  entryComponents: [VisitorsTaxSettingsComponent]
})
export class VisitorsTaxSettingsModule { }
