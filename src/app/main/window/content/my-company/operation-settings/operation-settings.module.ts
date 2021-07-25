import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';

// tslint:disable-next-line:max-line-length
import { ChangeCancellationComponent } from './operation-cancellation-terms-condition/change-cancellation-text/change-cancellation-text.component';
// tslint:disable-next-line:max-line-length
import { OperationCancellationTermsConditionComponent } from './operation-cancellation-terms-condition/operation-cancellation-terms-condition.component';
import { OperationEmailAdminComponent } from './operation-email-admin/operation-email-admin.component';
import { OperationGeneralComponent } from './operation-general/operation-general.component';
import { OperationSettingsDetailComponent } from './operation-settings-detail/operation-settings-detail.component';
import { OperationSettingsComponent } from './operation-settings.component';
@NgModule({
  declarations: [
    OperationSettingsComponent,
    OperationGeneralComponent,
    OperationEmailAdminComponent,
    OperationCancellationTermsConditionComponent,
    OperationSettingsDetailComponent,
    ChangeCancellationComponent,
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
  ],
  entryComponents: [OperationSettingsComponent, ChangeCancellationComponent],
})
export class OperationSettingsModule {}
