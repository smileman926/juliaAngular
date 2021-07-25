import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';

import {
  RoomSelectionAdministrationConfigComponent
} from './room-selection-administration/room-selection-administration-config/room-selection-administration-config.component';
import {
  RoomSelectionAdministrationPriceComponent
} from './room-selection-administration/room-selection-administration-price/room-selection-administration-price.component';
import {
  RoomSelectionAdministrationSettingsComponent
} from './room-selection-administration/room-selection-administration-settings/room-selection-administration-settings.component';
import { RoomSelectionAdministrationComponent } from './room-selection-administration/room-selection-administration.component';
import { RoomSelectionNotActiveComponent } from './room-selection-not-active/room-selection-not-active.component';


import { WishRoomComponent } from './wish-room.component';

@NgModule({
  declarations: [
    WishRoomComponent,
    RoomSelectionAdministrationComponent,
    RoomSelectionNotActiveComponent,
    RoomSelectionAdministrationSettingsComponent,
    RoomSelectionAdministrationPriceComponent,
    RoomSelectionAdministrationConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    HttpModule.forRoot(),
    NgbTooltipModule
  ],
  entryComponents: [
    WishRoomComponent
  ]
})
export class WishRoomModule { }
