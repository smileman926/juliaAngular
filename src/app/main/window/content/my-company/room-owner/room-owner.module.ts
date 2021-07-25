import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as UIKitModule } from '@/ui-kit/shared.module';

import { RoomOwnerComponent } from './room-owner.component';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { AddNewRoomOwnerComponent } from './add-new-room-owner/add-new-room-owner.component';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { RoomOwnerDetailsTabComponent } from './room-owner-tabs-container/room-owner-details-tab/room-owner-details-tab.component';
import { GetRoomNoPipe } from './room-owner-tabs-container/room-owner-rooms-tab/get-room-uniquno.pipe';
import { RoomOwnerRoomsTabComponent } from './room-owner-tabs-container/room-owner-rooms-tab/room-owner-rooms-tab.component';
import { RoomOwnerTabsContainerComponent } from './room-owner-tabs-container/room-owner-tabs-container.component';

@NgModule({
  declarations: [
    RoomOwnerComponent,
    RoomOwnerTabsContainerComponent,
    RoomOwnerDetailsTabComponent,
    RoomOwnerRoomsTabComponent,
    AddNewRoomOwnerComponent,
    AddNewRoomComponent,
    GetRoomNoPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    UIKitModule.forRoot(LanguageService, EbDatePipe),
    HttpModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    RoomOwnerComponent,
    AddNewRoomComponent,
    AddNewRoomOwnerComponent
  ]
})
export class RoomOwnerModule { }
