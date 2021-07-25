import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { GetImageNamePipe } from './portal-aat-pictures/get-image-name.pipe';
import { GetImageSizeInMBPipe } from './portal-aat-pictures/get-image-size-in-MB.pipe';
import { PortalAatPicturesComponent } from './portal-aat-pictures/portal-aat-pictures.component';
import { GetCheckBoxLabelPipe } from './portal-aat-portal/get-checkbox-label.pipe';
import { PortalAatPortalComponent } from './portal-aat-portal/portal-aat-portal.component';
import { PortalAATComponent } from './portal-aat.component';
import { PortalConfirmSubmitComponent } from './portal-confirm-submit/portal-confirm-submit.component';

@NgModule({
  declarations: [
    PortalAATComponent,
    PortalAatPortalComponent,
    PortalAatPicturesComponent,
    GetCheckBoxLabelPipe,
    PortalConfirmSubmitComponent,
    GetImageSizeInMBPipe,
    GetImageNamePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    HttpModule.forRoot()
  ],
  entryComponents: [PortalAATComponent, PortalConfirmSubmitComponent]
})
export class PortalAATModule { }
