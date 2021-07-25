import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-type';

@Component({
  selector: 'app-enquiry-pool-settings',
  templateUrl: './enquiry-pool-settings.component.pug',
  styleUrls: ['./enquiry-pool-settings.component.sass']
})
export class EnquiryPoolSettingsComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'general',
        label: 'BackEnd_WikiLanguage.CAT_General',
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'general';
  public selected: string;

  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  ngOnInit() {}
}
