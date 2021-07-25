import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ViewService } from '@/app/main/view/view.service';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

import { LanguageService } from '@/app/i18n/language.service';

@Component({
  selector: 'app-sugar-invoices',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class SugarInvoicesComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private viewService: ViewService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
    languageService: LanguageService,
  ) {
    super(loaderService, sanitizer, cacheService, languageService);
  }

  onMessage(event: MessageEvent): void {
    const message = event.data;
    if (!message) {
      return;
    }
    if (message.functionName === 'isiMessage' && typeof message.data === 'object') {
      switch (message.data.action) {
        case 'openMyEB':
          openSupportForm(this.viewService);
          break;
        case 'showBillingAddress':
        case 'hideBillingAddress':
          this.viewService.windowsService.resizeWindow.emit({ windowId: 'myAccount', width: null, height: message.data.data });
          super.sendMessage({
              type: 'customReceiveMessage',
              module : 'SugarInvoices',
              method : message.data.action
            });
          break;
      }
    }
  }

  ngOnInit() {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const dbName = this.mainService.getCompanyDetails().dbName;
    const username = '';

    this.loadIframe('/easybookingConfig', { cid, lid, dbName, username }, '#iframe/sugarInvoices');
  }
}
