import { ElementRef, EventEmitter, HostListener, OnDestroy, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';

import qs from 'query-string';
import { Observable } from 'rxjs';

import { CacheService } from '@/app/helpers/cache.service';
import { LanguageService } from '@/app/i18n/language.service';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';

import { LoaderType } from './loader-types';

export abstract class WindowIframeComponent implements OnDestroy {

  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Output() onload = new EventEmitter();
  @Output() moveToTop = new EventEmitter();

  iframeSrc: SafeResourceUrl | null = null;
  isLoading: Observable<boolean>;
  iframePath: string;
  iframeParams: IframeUrlParams;
  iframeHash: string;
  iframePrefix: string;

  private mouseIsOverIframe = false;

  @HostListener('mouseover')
  onMouseOver(): void {
    if (!this.mouseIsOverIframe) {
      this.mouseIsOverIframe = true;
      window.focus();
    }
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.mouseIsOverIframe = false;
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    if (this.mouseIsOverIframe) {
      this.moveToTop.emit();
    }
  }

  @HostListener('window:message', ['$event'])
  listenMessageEvent(e: MessageEvent): void {
    this.onMessage(e);
  }

  protected constructor(
    protected loaderService: LoaderService,
    private sanitizer: DomSanitizer,
    protected cacheService: CacheService,
    private languageService: LanguageService,
  ) {
    this.isLoading = this.loaderService.isLoadingAnyOf([LoaderType.Iframe, LoaderType.Download]);
    this.languageService.languageId$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.iframeSrc && this.iframeParams && this.iframeHash !== '#iframe/hotelManagement/newRoomplan') {
        if (this.iframeParams.hasOwnProperty('language')) {
          this.iframeParams.language = this.languageService.getLanguageId();
        }
        if (this.iframeParams.hasOwnProperty('lid')) {
          this.iframeParams.lid = this.languageService.getLanguageId();
        }
        this.loadIframe(this.iframePath, this.iframeParams, this.iframeHash, this.iframePrefix);
      }
    });
  }

  onStartLoad(): void {
    // console.log('onStartLoad');
    this.loaderService.show(LoaderType.Iframe);
  }

  onLoaded(): void {
    if (!this.iframeSrc) { return; }
    // console.log('onLoaded');
    this.loaderService.hide(LoaderType.Iframe);
    this.onload.emit();
    setTimeout(() => {
      this.sendMessage({ type: 'countryId', data: this.cacheService.getCompanyDetailsSnapshot().customer_country_id });
    }, 1000);
  }

  onMessage(e: MessageEvent): void {}

  sendMessage(data: any): void {
    const iframe = this.iframe.nativeElement as HTMLIFrameElement;

    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
    }
  }

  loadIframe(path?: string, params?: IframeUrlParams, hash?: string, prefix?: string): void {
    if (path) {
      this.iframePath = path;
    }
    if (params) {
      this.iframeParams = params;
    }
    this.iframeHash = hash ? hash : '';
    this.iframePrefix = prefix ? prefix : environment.legacyContentUrl;

    const src = buildUrl(this.iframePrefix, this.iframePath, this.iframeParams, this.iframeHash);
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    this.onStartLoad();
  }

  ngOnDestroy(): void {}
}

function buildUrl(prefix: string, path: string, params: IframeUrlParams, hash: string): string {
  const base = path.match(/^http(s)?:\/\//) ? path : prefix + path;
  const paramsDivider = base.match(/\?/) ? '&' : '?';
  const paramsStr = qs.stringify(params);
  let src: string = base;
  if (paramsStr) {
    src += paramsDivider + paramsStr;
  }
  src += hash;
  return src;
}

export interface IframeUrlParams {
  [key: string]: string | number;
}
