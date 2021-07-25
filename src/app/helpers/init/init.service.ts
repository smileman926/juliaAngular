import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService, saveToken } from '@/app/auth/auth.service';
import { ServiceState } from '@/app/helpers/models';
import { getNumericParam, getParam, redirectToCustomer, redirectToLogin } from '@/app/helpers/static.functions';
import { LanguageService } from '@/app/i18n/language.service';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitService implements OnDestroy {
  private loaded = new BehaviorSubject<boolean>(false);
  public loaded$ = this.loaded.asObservable();

  constructor(
    private authService: AuthService,
    private languageService: LanguageService
  ) {
    if (!cleanUpParameters()) {
      return;
    }
    this.authService.init();
    const authServiceReady: Observable<boolean> = this.authService.state$.pipe(
      untilDestroyed(this),
      map(state => state === ServiceState.Ready)
    );
    const languageServiceReady: Observable<boolean> = this.languageService.state$.pipe(
      untilDestroyed(this),
      map(state => state === ServiceState.Ready)
    );
    combineLatest(authServiceReady, languageServiceReady).subscribe(states => {
      if (states.every(value => value)) {
        this.loaded.next(true);
      }
    });
  }

  ngOnDestroy(): void {}
}

function cleanUpParameters(): boolean {
  const customerId = getNumericParam('customer');
  const accessToken = getParam('token');
  const rememberMe = getParam('rememberMe');
  const legacyCustomerId = getNumericParam('c_id');
  const legacyLanguageId = getNumericParam('l_id');
  const legacyVersionNumber = getParam('v');
  const needsRedirect = [accessToken, legacyCustomerId, legacyLanguageId, legacyVersionNumber].some(value => value !== undefined);
  if (accessToken) {
    saveToken(accessToken, rememberMe === '1');
  } else if (environment.token) {
    saveToken(environment.token, false);
    if (environment.remoteUrlToSetToken) {
      setRemoteToken();
    }
  }
  if (needsRedirect) {
    const actualCustomerId = customerId ? customerId : legacyCustomerId;
    if (!actualCustomerId) {
      redirectToLogin();
      return false;
    }
    redirectToCustomer(actualCustomerId);
  }
  if (!customerId && environment.defaultCustomerId) {
    redirectToCustomer(environment.defaultCustomerId);
    return false;
  }
  return !needsRedirect;
}

function setRemoteToken(): void {
  if (!environment || !environment.remoteUrlToSetToken || !environment.token) {
    return;
  }
  const iframe = document.createElement('iframe');
  const url = environment.remoteUrlToSetToken.replace('{{TOKEN}}', environment.token);
  iframe.setAttribute('src', url);
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.addEventListener('load', () => {
    iframe.remove();
  });
  document.body.append(iframe);
}
