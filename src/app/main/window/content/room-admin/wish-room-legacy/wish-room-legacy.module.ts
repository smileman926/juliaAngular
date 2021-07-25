import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { SharedModule } from '@/app/shared/module';

import { HttpModule } from '@/app/shared/http.module';
import { WishRoomLegacyComponent } from './wish-room-legacy.component';
import { WishRoomAdministrationComponent } from './wish-room-administration/wish-room-administration.component';
import { WishRoomModuleNotActiveComponent } from './wish-room-module-not-active/wish-room-module-not-active.component';

@NgModule({
  declarations: [WishRoomLegacyComponent, WishRoomAdministrationComponent, WishRoomModuleNotActiveComponent],
  imports: [
    CommonModule,
    HttpModule.forRoot(),
    EasybookingUISharedModule,
    SharedModule,
  ],
  entryComponents: [WishRoomLegacyComponent]
})
export class WishRoomModuleLegacy { }
