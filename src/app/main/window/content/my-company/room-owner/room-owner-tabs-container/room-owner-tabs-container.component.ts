import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { CountryInfoModel } from '@/app/main/models';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { EntityOwnerProfile } from '../models';

@Component({
  selector: 'app-room-owner-tabs-container',
  templateUrl: './room-owner-tabs-container.component.pug',
  styleUrls: ['./room-owner-tabs-container.component.sass']
})
export class RoomOwnerTabsContainerComponent {

  @Input() entity!: EntityOwnerProfile;
  @Input() countriesList: CountryInfoModel[];
  @Output() initWidget = new EventEmitter();

  public activeTabId = 'details';
  public isLoading: Observable<boolean>;
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'details',
        label: 'ebc.roomOwner.tab_details.text'
      },
      {
        id: 'rooms',
        label: 'ebc.roomOwner.tab_rooms.text'
      }
    ]
  };

  constructor(
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_TAB);
  }

  init(): void {
    this.initWidget.emit();
  }
}
