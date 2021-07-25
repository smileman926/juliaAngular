import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { CacheService } from '@/app/helpers/cache.service';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
@Component({
  selector: 'app-operation-settings',
  templateUrl: './operation-settings.component.pug',
  styleUrls: ['./operation-settings.component.sass'],
})
export class OperationSettingsComponent implements OnInit {
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'General',
        label: 'BackEnd_WikiLanguage.CAT_General',
      },
      {
        id: 'Email_Admin',
        label: 'BackEnd_WikiLanguage.EMA_EMailAdmin',
      },
      {
        id: 'Cancellation_Terms_Conditions',
        label: 'ebc.hotelManagement.tab_stornoAndAGB.text',
      },
      {
        id: 'Settings',
        label: 'BackEnd_WikiLanguage.CMS_OptionSettings',
      },
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'General';
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
