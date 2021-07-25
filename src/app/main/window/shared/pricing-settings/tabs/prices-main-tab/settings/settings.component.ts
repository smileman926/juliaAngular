import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { PricingSchemeType, PricingSettings } from '@/app/main/window/shared/pricing-settings/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.pug',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit, OnDestroy {

  @Input() pricingSettings!: PricingSettings;
  @Output() pricingSettingsChange: EventEmitter<PricingSettings> = new EventEmitter();
  @Input() showCleanupCharge: boolean;
  @Input() formsSaved!: EventEmitter<void>;
  @Input() pricingScheme: PricingSchemeType;
  @Output() formDirtyChange: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  private formData: PricingSettings;

  public PricingSchemeType = PricingSchemeType;

  constructor() {}

  public updateValues(): void {
    this.formData = normalizeValues(this.formData);
    Object.keys(this.formData).filter(key => this.formData.hasOwnProperty(key)).forEach(key => {
      const control = this.form.get(key) as FormControl;
      if (control) {
        control.setValue(this.formData[key], {emitEvent: false});
      }
    });
    this.pricingSettings = this.formData;
    this.pricingSettingsChange.emit(this.pricingSettings);
  }

  private markFormAsPristine(): void {
    if (!this.form) {
      return;
    }
    this.form.markAsPristine();
    this.formDirtyChange.emit(this.form.dirty);
  }

  private setupForm(): void {
    this.form = new FormGroup({
      cleanUpPrice: new FormControl(this.pricingSettings.cleanUpPrice),
      minPersons: new FormControl(this.pricingSettings.minPersons),
      maxPersons: new FormControl(this.pricingSettings.maxPersons),
      stdPricePosition: new FormControl(this.pricingSettings.stdPricePosition),
      childDiscountStartPosition: new FormControl(this.pricingSettings.childDiscountStartPosition),
      childUnderXForFree: new FormControl(this.pricingSettings.childUnderXForFree)
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      this.formData = values;
    });
    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.formsSaved) {
      this.formsSaved.pipe(untilDestroyed(this)).subscribe(() => {
        this.markFormAsPristine();
      });
    }
  }

  ngOnDestroy(): void {}

}

function normalizeValues(formData: PricingSettings): PricingSettings {
  if (!formData) {
    return formData;
  }
  formData.minPersons = Math.max(formData.minPersons, 1);
  formData.maxPersons = Math.max(formData.minPersons, formData.maxPersons);
  formData.stdPricePosition = normalizeValue(formData.stdPricePosition, formData.minPersons, formData.maxPersons);
  formData.childDiscountStartPosition = normalizeValue(formData.childDiscountStartPosition, 0, formData.maxPersons);
  return formData;
}

function normalizeValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
