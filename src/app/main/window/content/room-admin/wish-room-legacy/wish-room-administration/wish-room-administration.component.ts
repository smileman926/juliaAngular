import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../../shared/window-iframe/window-iframe.component';

import { LanguageService } from '@/app/i18n/language.service';

@Component({
  selector: 'app-wish-room-administration',
  templateUrl: '../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../../shared/window-iframe/window-iframe.component.sass']
})
export class WishRoomAdministrationComponent extends WindowIframeComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private eventBusService: EventBusService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
    languageService: LanguageService,
  ) {
    super(loaderService, sanitizer, cacheService, languageService);
  }

  ngOnInit(): void {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const companyDetails = this.mainService.getCompanyDetails();
    const dbName = companyDetails.dbName;
    const username = '';
    const jumpToPriceometer = 0;

    this.loadIframe('/easybookingConfig', { cid, lid, username, dbName, jumpToPriceometer }, '#iframe/wishRoomAdministration');
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue && !top.currentValue) {
      sendRoomplanUpdate(this.eventBusService, 'wrmConfigUpdated');
    }
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
    sendRoomplanUpdate(this.eventBusService, 'wrmConfigUpdated');
  }
}
