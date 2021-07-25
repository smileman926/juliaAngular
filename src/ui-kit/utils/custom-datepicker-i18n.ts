import { LanguageService } from '@/app/i18n/language.service';
import {Injectable} from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// Define custom service providing the months and weekdays translations

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private languageService: LanguageService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return this.languageService.getWeekdayShortName(weekday);
  }

  getMonthShortName(month: number): string {
    return this.languageService.getMonthShortName(month);
  }

  getMonthFullName(month: number): string {
    return this.languageService.getMonthName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return '';
  }
}
