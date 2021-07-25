import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CacheService } from '@/app/helpers/cache.service';
import { LanguageService } from '@/app/i18n/language.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

import { AuthService } from '@/app/auth/auth.service';

@Component({
  selector: 'app-message-center',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class MessageCenterComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    protected cacheService: CacheService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    languageService: LanguageService,
  ) {
    super(loaderService, sanitizer, cacheService, languageService);
  }

  private async init(): Promise<void> {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const { dbName } = await this.cacheService.getCompanyDetails();

    if (!cid || !dbName) {
      console.error('CID: ', cid, 'or dbName:', dbName, 'is empty');
      return;
    }

    this.loadIframe('/easybookingConfig', {cid, lid, dbName}, '#iframe/adminMessageCenter');
  }

  ngOnInit(): void {
    this.init();
  }
}
