import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService as ILangService } from 'easybooking-ui-kit/injection';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { defaultLanguageId } from '../helpers/constants';
import { ServiceState } from '../helpers/models';
import { getNumericParam } from '../helpers/static.functions';

const TRANSLATIONS = {
  '1': {
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  '2': {
    weekdays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    weekdaysShort: ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService implements ILangService {
  //#region streams
  private languageId = new BehaviorSubject<number>(defaultLanguageId);
  public languageId$: Observable<number>;
  private state = new BehaviorSubject<ServiceState>(ServiceState.Loading);
  public state$: Observable<ServiceState> = this.state.asObservable();
  //#endregion

  private currentDateTranslations: DateTranslations | null;

  constructor(
    private translate: TranslateService,
  ) {
    this.languageId$ = this.languageId.asObservable().pipe(distinctUntilChanged());
    this.init().catch();
  }

  public async setLanguage(languageId: number): Promise<void> {
    if (this.languageId.getValue() === languageId) {
      this.setCurrentDateTranslations();
      return;
    }
    localStorage.setItem(paramKey, String(languageId));
    const key = extractLangKey(languageId);
    if (!key) {
      return;
    }
    await this.translate.use(key).toPromise();
    this.languageId.next(languageId);
    this.registerLocaleModule(key).catch();
    this.setCurrentDateTranslations();
  }

  public getLanguageCode(): string {
    return extractLangKey(this.getLanguageId());
  }

  public getLanguageId(): number {
    return this.languageId.getValue();
  }

  /**
   * Get full name of the weekday (1-7)
   *
   * Returns short name if no full name available
   */
  public getWeekdayName(weekday: number): string {
    if (this.currentDateTranslations) {
      if (this.currentDateTranslations.weekdays) {
        return this.currentDateTranslations.weekdays[weekday - 1];
      } else if (this.currentDateTranslations.weekdaysShort) {
        return this.currentDateTranslations.weekdaysShort[weekday - 1];
      }
    }
    return '';
  }

  /**
   * Get short name of the weekday (1-7)
   *
   * Returns full name if no short name available
   */
  public getWeekdayShortName(weekday: number): string {
    if (this.currentDateTranslations) {
      if (this.currentDateTranslations.weekdaysShort) {
        return this.currentDateTranslations.weekdaysShort[weekday - 1];
      } else if (this.currentDateTranslations.weekdays) {
        return this.currentDateTranslations.weekdays[weekday - 1];
      }
    }
    return '';
  }

  /**
   * Get full name of the month (1-12)
   *
   * Returns short name if no full name available
   */
  public getMonthName(month: number): string {
    if (this.currentDateTranslations) {
      if (this.currentDateTranslations.months) {
        return this.currentDateTranslations.months[month - 1];
      } else if (this.currentDateTranslations.monthsShort) {
        return this.currentDateTranslations.monthsShort[month - 1];
      }
    }
    return '';
  }

  /**
   * Get short name of the weekday (1-7)
   *
   * Returns full name if no short name available
   */
  public getMonthShortName(month: number): string {
    if (this.currentDateTranslations) {
      if (this.currentDateTranslations.monthsShort) {
        return this.currentDateTranslations.monthsShort[month - 1];
      } else if (this.currentDateTranslations.months) {
        return this.currentDateTranslations.months[month - 1];
      }
    }
    return '';
  }

  async registerLocaleModule(localeCode: string): Promise<void> {
    localeCode = localeCode.replace('_', '-');
    return import(`@angular/common/locales/${localeCode}.js`)
      .then(module => registerLocaleDataWithFix(module.default, localeCode))
      .catch(() => {
        const simpleLocaleCode = localeCode.substr(0, 2);
        if (simpleLocaleCode !== localeCode) {
          return this.registerLocaleModule(simpleLocaleCode);
        }
      })
    ;
  }

  /**
   * Set the current translation object based on the selected language
   */
  private setCurrentDateTranslations() {
    if (TRANSLATIONS.hasOwnProperty(String(this.languageId.getValue()))) {
      this.currentDateTranslations = TRANSLATIONS[String(this.languageId.getValue())];
    } else if (TRANSLATIONS.hasOwnProperty(String(defaultLanguageId))) {
      this.currentDateTranslations = TRANSLATIONS[String(defaultLanguageId)];
    } else {
      this.currentDateTranslations = null;
    }
  }

  private async init(): Promise<void> {
    this.translate.setDefaultLang(extractLangKey(defaultLanguageId));
    await this.setLanguage(getNumericParam(paramKey, true) || defaultLanguageId);
    this.state.next(ServiceState.Ready);
  }
}

const paramKey = 'language';

function extractLangKey(id: number): string {
  const keyValue = { 1: 'en_GB', 2: 'de_AT' };
  if (!id || !keyValue.hasOwnProperty(id)) {
    throw new Error(`Language ID #${id} is not defined`);
  }
  return keyValue[id];
}

function registerLocaleDataWithFix(data: any, localeCode: string): void {
  switch (localeCode) {
  case 'de-AT':
    // fix for at formats
    data[13][1] = '.'; // thousand separators
    data[13][12] = ','; // decimal separators
    break;
  case 'de':
    // fix for de formats
    data[13][0] = ','; // thousand separators
    data[13][1] = '.'; // decimal separators
    break;
  }
  registerLocaleData(data);
}

interface DateTranslations {
  weekdays?: string[];
  weekdaysShort?: string[];
  months?: string[];
  monthsShort?: string[];
}
