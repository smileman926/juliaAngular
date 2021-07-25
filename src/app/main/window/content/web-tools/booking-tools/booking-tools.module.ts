import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColorPickerModule } from 'ngx-color-picker';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';

import { BookingToolsComponent } from './booking-tools.component';

import { BookingToolsGapfilterComponent } from './booking-tools-gapfilter/booking-tools-gapfilter.component';
import { BookingToolsLayoutComponent } from './booking-tools-layout/booking-tools-layout.component';
import { BookingToolsLocalesComponent } from './booking-tools-locales/booking-tools-locales.component';
import { BookingToolsMessagesComponent } from './booking-tools-messages/booking-tools-messages.component';
import { BookingToolsPartnerComponent } from './booking-tools-partner/booking-tools-partner.component';
import { BookingToolsPricemeterComponent } from './booking-tools-pricemeter/booking-tools-pricemeter.component';
import { BookingToolsRequiresComponent } from './booking-tools-requires/booking-tools-requires.component';
import { BookingToolsSaraComponent } from './booking-tools-sara/booking-tools-sara.component';
import { BookingToolsSettingsComponent } from './booking-tools-settings/booking-tools-settings.component';
import { BookingToolsTextsComponent } from './booking-tools-texts/booking-tools-texts.component';
import { BookingTextTranslateComponent } from './booking-tools-texts/translate-text/translate-text.component';

@NgModule({
  declarations: [
    BookingToolsComponent,
    BookingToolsGapfilterComponent,
    BookingToolsLayoutComponent,
    BookingToolsLocalesComponent,
    BookingToolsMessagesComponent,
    BookingToolsPartnerComponent,
    BookingToolsPricemeterComponent,
    BookingToolsRequiresComponent,
    BookingToolsSaraComponent,
    BookingToolsSettingsComponent,
    BookingToolsTextsComponent,
    BookingTextTranslateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    HttpModule.forRoot(),
    ColorPickerModule
  ],
  entryComponents: [BookingToolsComponent, BookingTextTranslateComponent]
})
export class BookingToolsModule { }
