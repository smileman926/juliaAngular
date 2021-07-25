import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';

import { ModalService } from '@/ui-kit/services/modal.service';

import { SendToRoomplanEvent } from '@/app/main/window/content/calendar/calendar-html/events';
import { EventBusService } from '@/app/main/window/shared/event-bus';

import { ApiClient } from '@/app/helpers/api-client';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { CalendarSettings, ICSEvent } from './models';

@Component({
  selector: 'app-calendar-settings',
  templateUrl: './calendar-settings.component.pug',
  styleUrls: ['./calendar-settings.component.sass']
})
export class CalendarSettingsComponent implements OnInit {
  private newPeriodName: string;
  public dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public calendarSettings: CalendarSettings;
  public isSaveProcessing = false;
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private translate: TranslateService,
    private eventBus: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.CALENDAR_SETTINGS);
  }

  public addNewItem(): void {
    this.calendarSettings.periodsColor.push({
      id: null,
      name: this.newPeriodName ? this.newPeriodName : 'Period name',
      fromDate: new Date(),
      untilDate: new Date(),
      color: '#ffffff',
      _tempId: Math.floor(Math.random() * 10000)
    });
  }

  public deleteItem(period: CalendarSettings['periodsColor'][0]): void {
    const { periodsColor } = this.calendarSettings;
    periodsColor.splice(periodsColor.indexOf(period), 1);
  }

  @Loading(LoaderType.CALENDAR_SETTINGS)
  public async save(): Promise<void> {
    await this.apiClient.saveCalendarSettings(this.calendarSettings).toPromise();
    this.calendarSettings = await this.apiClient.getCalendarSettings().toPromise();
    this.eventBus.emit<SendToRoomplanEvent>('sendToRoomplan', { method: 'colorAdminDone', object: { status: 'ok' }});
  }

  public async onICSImport() {
    const file  = await selectFileDialog('text/calendar');
    if (!file) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      if (reader.result) {
        const events = this.ICSDataParser((reader.result).toString());
        if (events) {
          events.forEach(event => {
            if (event.startDate && event.endDate) {
              let periodName = '';
              if (event.summary) {
                periodName = event.summary;
              }
              if (periodName === '' && event.description) {
                periodName = event.description;
              }
              this.calendarSettings.periodsColor.push({
                id: null,
                name: periodName,
                fromDate: event.startDate,
                untilDate: event.endDate,
                color: '#ffffff',
                _tempId: Math.floor(Math.random() * 10000)
              });
            }
          });
        }
      }
    };
  }

  private ICSDataParser(icsData: string): ICSEvent[] {
    const NEW_LINE = /\r\n|\n|\r/;

    const EVENT = 'VEVENT';
    const EVENT_START = 'BEGIN';
    const EVENT_END = 'END';
    const START_DATE = 'DTSTART';
    const END_DATE = 'DTEND';
    const DESCRIPTION = 'DESCRIPTION';
    const SUMMARY = 'SUMMARY';
    const LOCATION = 'LOCATION';
    const ALARM = 'VALARM';

    const keyMap = {
      [START_DATE]: 'startDate',
      [END_DATE]: 'endDate',
      [DESCRIPTION]: 'description',
      [SUMMARY]: 'summary',
      [LOCATION]: 'location'
    };

    const clean = str => decodeURI(str).trim();
    const events: any[] = [];
    let currentObj: ICSEvent = {};
    let lastKey = '';
    const lines = icsData.split(NEW_LINE);
    let isAlarm = false;

    for (let i = 0, iLen = lines.length; i < iLen; ++i) {
      const line = lines[i];
      const lineData = line.split(':');

      let key = lineData[0];
      const value = lineData[1];

      if (key.indexOf(';') !== -1) {
        const keyParts = key.split(';');
        key = keyParts[0]; // Maybe do something with that second part later
      }

      if (lineData.length < 2) {
        if (key.startsWith(' ') && lastKey !== undefined && lastKey.length) {
          currentObj[lastKey] += clean(line.substr(1));
        }
        continue;
      } else {
        lastKey = keyMap[key];
      }

      switch (key) {
        case EVENT_START:
          if (value === EVENT) {
            currentObj = {};
          } else if (value === ALARM) {
            isAlarm = true;
          }
          break;
        case EVENT_END:
          isAlarm = false;
          if (value === EVENT) {
            events.push(currentObj);
          }
          break;
        case START_DATE:
          currentObj[keyMap[START_DATE]] = this.iCalDateParser(value);
          break;
        case END_DATE:
          currentObj[keyMap[END_DATE]] = this.iCalDateParser(value);
          break;
        case DESCRIPTION:
          if (!isAlarm) {
            currentObj[keyMap[DESCRIPTION]] = clean(value);
          }
          break;
        case SUMMARY:
          currentObj[keyMap[SUMMARY]] = clean(value);
          break;
        case LOCATION:
          currentObj[keyMap[LOCATION]] = clean(value);
          break;
      }
    }
    return events;
  }

  /**
   * Parser is required because the date is not always in a valid format
   * iCalStr e.g. '20110914T184000Z' but it can be '20110914'
   */
  private iCalDateParser(iCalStr: string): Date {
    const strYear = +iCalStr.substr(0, 4);
    const strMonth = parseInt(iCalStr.substr(4, 2), 10) - 1;
    const strDay = +iCalStr.substr(6, 2);
    const strHour = +iCalStr.substr(9, 2);
    const strMin = +iCalStr.substr(11, 2);
    const strSec = +iCalStr.substr(13, 2);
    return new Date(strYear, strMonth, strDay, strHour, strMin, strSec);
  }

  @Loading(LoaderType.CALENDAR_SETTINGS)
  async ngOnInit() {
    await this.translate.get(
      ['BackEnd_WikiLanguage.CalendarColorPeriod', 'FrontEnd_WikiLanguage.EQP_dayNames']
    ).toPromise().then((translations) => {
      this.newPeriodName = translations['BackEnd_WikiLanguage.CalendarColorPeriod'];
      this.dayNames =
        translations['FrontEnd_WikiLanguage.EQP_dayNames'].split(',').length === 7 ?
          translations['FrontEnd_WikiLanguage.EQP_dayNames'].split(',') :
          this.dayNames;
      this.dayNames = this.dayNames.map((d) => {
        return d.split('"').join('');
      });
    });
    this.calendarSettings = await this.apiClient.getCalendarSettings().toPromise();
  }
}
