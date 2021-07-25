import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { CacheService } from '@/app/helpers/cache.service';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-booking-tools',
  templateUrl: './booking-tools.component.pug',
  styleUrls: ['./booking-tools.component.sass']
})
export class BookingToolsComponent implements OnInit {
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'Settings',
        label: 'ebc.tabs.settings.text',
      },
      {
        id: 'Locales',
        label: 'ebc.bookingTools.tab_locale.text',
      },
      {
        id: 'Layout',
        label: 'ebc.bookingTools.tab_layout.text',
      },
      {
        id: 'Texts',
        label: 'ebc.bookingTools.tab_text.text',
      },
      {
        id: 'Messages',
        label: 'ebc.bookingTools.tab_messages.text',
      },
      {
        id: 'Required Fields',
        label: 'ebc.bookingTools.tab_mandatoryFields.text',
      },
      {
        id: 'Price-O-Meter',
        label: 'ebc.bookingTools.tab_priceOMeter.text',
      },
      {
        id: 'Gap Filler',
        label: 'ebc.bookingTools.tab_gapFiller.text',
      },
      {
        id: 'Partner',
        label: 'ebc.bookingTools.tab_thankYouPagePartnerSettings.text',
      },
      {
        id: 'SARA App',
        label: 'ebc.bookingTools.tab_saraApp.text',
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'Settings';
  public selected: string;

  public isLoading: Observable<boolean>;

  constructor(
    protected cacheService: CacheService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  ngOnInit(): void {}
}
