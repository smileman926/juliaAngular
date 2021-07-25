import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-portal-aat',
  templateUrl: './portal-aat.component.pug',
  styleUrls: ['./portal-aat.component.sass']
})
export class PortalAATComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'portal',
        label: 'ebc.portalAAT.tab_admin.text',
      },
      {
        id: 'pictures',
        label: 'ebc.portalAAT.tab_pictures.text',
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'portal';
  public selected: string;

  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  ngOnInit(): void {}

}
