import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { checkAllCheckboxes, normalizeInterval } from '@/app/main/window/shared/forms/utils';
import { weekDays } from '@/app/main/window/shared/periods/consts';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SendToRoomplanEvent } from '../../../../calendar/calendar-html/events';
import { LoaderType } from '../../loader-types';
import { SpecialOffer, SpecialOfferPricing } from '../../models';
import { PeriodsComponent } from './periods/periods.component';

import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';
import { FormatService } from '@/ui-kit/services/format.service';

@Component({
  selector: 'app-pricing-tab',
  templateUrl: './pricing.component.pug',
  styleUrls: ['./pricing.component.sass']
})
export class PricingComponent implements OnChanges {

  @Input() offer!: SpecialOffer;
  @Output() saved = new EventEmitter();

  private bookableRangePlaceholder = '';

  public details: SpecialOfferPricing;
  public form: FormGroup;
  public weekDays = weekDays;
  public validity: {
    validRange: boolean,
    prices: boolean,
    ageGroups: boolean
  } = {
    validRange: true,
    prices: true,
    ageGroups: true
  };

  public isSaveEnabled = true;

  @ViewChild('periodsComponent', { static: false }) public periodsComponent!: PeriodsComponent;

  constructor(
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
    private formatService: FormatService,
    private apiClient: ApiClient,
    private mainService: MainService,
    public loaderService: LoaderService,
    private eventBus: EventBusService
  ) { }

  @Loading(LoaderType.LOAD_TAB)
  public async load(): Promise<void> {
    this.details = await this.apiClient.getSpecialOfferPricingDetail(this.offer).toPromise();
    this.loadForm();
  }

  public loadForm(): void {
    this.bookableRangePlaceholder = '';
    const company = this.mainService.getCompanyDetails();
    const quotaCatering = company.c_methodDefaultCatering === 'quota';

    const fromDate = new FormControl(this.details.offer.fromDate);
    const untilDate = new FormControl(this.details.offer.untilDate);
    const nightsStay = new FormControl(this.details.offer.nightsStay || 7);
    const allArrival = new FormControl(Object.values(this.details.offer.days).every(checked => checked));
    const daysArrival = new FormArray(this.weekDays.map(d => new FormControl(this.details.offer.days[d.id])));
    const autoCosts = new FormControl({ value: this.details.offer.individualCatering || quotaCatering, disabled: quotaCatering });
    const minPersons = new FormControl(this.details.offer.minPersons || 2);
    const maxPersons = new FormControl(this.details.offer.maxPersons || 2);

    this.form = new FormGroup({
      fromDate,
      untilDate,
      bookableFromDate: new FormControl(this.details.offer.bookableFromDate),
      bookableUntilDate: new FormControl(this.details.offer.bookableUntilDate),
      autoCosts,
      nightsStay,
      minPersons,
      maxPersons,
      arrival: new FormGroup({
        all: allArrival,
        days: daysArrival
      })
    });

    autoCosts.valueChanges.subscribe(enabled => this.setIndividualCatering(enabled));
    normalizeInterval(minPersons, maxPersons);
    checkAllCheckboxes(allArrival, daysArrival);
  }

  @Loading(LoaderType.LOAD_TAB)
  async setIndividualCatering(enabled: boolean): Promise<void> {
    await this.apiClient.setIndividualCatering(this.details.offer, enabled).toPromise();
    this.details.offer.individualCatering = enabled;
    this.offer.individualCatering = enabled;
    this.notifyRoomplan();
  }

  @Loading(LoaderType.LOAD_TAB)
  async save(forAll = false): Promise<void> {
    const {
      fromDate, untilDate,
      bookableFromDate, bookableUntilDate,
      autoCosts: individualCatering,
      nightsStay, minPersons, maxPersons,
      arrival
    } = this.form.getRawValue();
    const offer: SpecialOffer = {
      ...this.details.offer,
      fromDate, untilDate,
      bookableFromDate, bookableUntilDate,
      individualCatering,
      nightsStay, minPersons, maxPersons,
      days: {
        mo: arrival.days[0],
        tu: arrival.days[1],
        we: arrival.days[2],
        th: arrival.days[3],
        fr: arrival.days[4],
        sa: arrival.days[5],
        su: arrival.days[6],
      },
    };
    if (offer.bookableFromDate === null) {
      offer.bookableFromDate = offer.fromDate;
    }
    if (offer.bookableUntilDate === null) {
      offer.bookableUntilDate = offer.untilDate;
    }
    await this.apiClient.saveSpecialOfferPricing(offer, this.details, forAll).toPromise();
    this.notifyRoomplan();
    this.saved.emit();
  }

  public notifyRoomplan(): void { // TODO c&p
    this.eventBus.emit<SendToRoomplanEvent>('sendToRoomplan', { method: 'specialOfferAdminChanged', object: { status: 'ok' }});
  }

  public onDateChange(dateField: string, value: Date): void {
    const control = this.form.get(dateField) as FormControl;
    if (control && this.form) {
      control.markAsTouched();
      control.setValue(value);
      this.refreshBookableRangePlaceholder(dateField);
    }
  }

  private refreshBookableRangePlaceholder(dateField: string) {
    let fromDate: Date | null = null;
    let untilDate: Date | null = null;
    if (dateField === 'bookableUntilDate') {
      fromDate = (this.form.get('bookableFromDate') as FormControl).value;
      untilDate = (this.form.get('bookableUntilDate') as FormControl).value;
    } else if (dateField === 'untilDate' &&
      (this.form.get('bookableFromDate') as FormControl).value === null &&
      (this.form.get('bookableUntilDate') as FormControl).value === null
    ) {
      fromDate = (this.form.get('fromDate') as FormControl).value;
      untilDate = (this.form.get('untilDate') as FormControl).value;
    }
    if (fromDate && untilDate) {
      const rangeDateStringDivider = ' - ';
      const startDateStr = this.formatService.dateFormat(fromDate, this.dateFormatter.getFormat());
      const endDateStr = this.formatService.dateFormat(untilDate, this.dateFormatter.getFormat());
      this.bookableRangePlaceholder = startDateStr + rangeDateStringDivider + endDateStr;
    }
  }

  public onValidityChange(component: 'validRange' | 'prices' | 'ageGroups', valid: boolean): void {
    this.validity[component] = valid;
    this.isSaveEnabled = this.validity.validRange && this.validity.prices && this.validity.ageGroups;
  }

  ngOnChanges({ offer }: SimpleChanges): void {
    if (offer && offer.previousValue !== offer.currentValue) {
      this.load();
    }
  }
}
