import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { WishRoomData } from '../models';

@Component({
  selector: 'app-room-selection-administration',
  templateUrl: './room-selection-administration.component.pug',
  styleUrls: ['./room-selection-administration.component.sass']
})
export class RoomSelectionAdministrationComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'settings',
        label: 'ebc.tabs.settings.text',
      },
      {
        id: 'price_manage',
        label: 'ebc.tabs.priceManagement.text',
        disabled: false,
      },
      {
        id: 'config',
        label: 'ebc.tabs.configuration.text',
        disabled: false,
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'settings';
  public selected: string;
  public wishRoomData: WishRoomData;
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.wishRoomData = await this.apiHotel.getWishRoomData().toPromise();
    const { config } = this.wishRoomData;
    this.setupTabsVisibility(config.wc_active);
  }

  private setupTabsVisibility(flag: string): void {
    switch (flag) {
      case 'on':
        this.tabSettings.buttons.map( l => {
          if (l.id === 'price_manage') {
            l.disabled = false;
          }
          if (l.id === 'config') {
            l.disabled = true;
          }
        });
        break;
      case 'off':
        this.tabSettings.buttons.map( l => {
          if (l.id === 'price_manage') {
            l.disabled = true;
          }
          if (l.id === 'config') {
            l.disabled = false;
          }
        });
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.init();
  }
}

