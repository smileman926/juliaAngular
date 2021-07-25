import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

import { LanguageService } from '@/app/i18n/language.service';

@Component({
  selector: 'app-guest-map',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class GuestMapComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
    languageService: LanguageService,
  ) {
    super(loaderService, sanitizer, cacheService, languageService);
  }

  ngOnInit() {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();

    this.loadIframe('/easybookingConfig', { cid, lid }, '#iframe/guestMap');
  }
}
