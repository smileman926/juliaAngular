import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { deepCompare } from '@/ui-kit/utils/compare';
import {
  ageGroupFocusOnEnterMap,
  PersonPricingEntity,
  PricesFormGroupItem,
  pricesFormGroupMap,
  PricingAgeGroup,
  PricingPrices,
  PricingSchemeType
} from '../../../models';
import { isPricingSchemePercentBased, mapAgeGroupToEntityAgeGroup } from '../../../utils';
import { getOrCreatePersonFormGroup } from '../create-form-group';

@Component({
  selector: 'app-person-prices',
  templateUrl: './person-prices.component.pug',
  styleUrls: ['./person-prices.component.sass']
})
export class PersonPricesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() ageGroups: PricingAgeGroup[];
  @Input() cateringId: number;
  @Input() formsSaved!: EventEmitter<void>;
  @Input() fullPayers: number;
  @Input() prices?: PricingPrices;
  @Output() pricesChange: EventEmitter<PersonPricesComponent['prices']> = new EventEmitter();
  @Input() pricingScheme?: PricingSchemeType;
  @Input() stdPricePosition?: number;
  @Output() formDirtyChange: EventEmitter<boolean> = new EventEmitter();

  public currentPrices?: {
    prices: PersonPricingEntity[],
    index: number
  };
  public form: FormGroup;
  public focusOnEnterMaps: ageGroupFocusOnEnterMap;
  private formGroupMap: Map<number, pricesFormGroupMap>;
  private formValues: FormValues;
  private cateringIdMap: Map<number, string>;

  public PricingSchemeType = PricingSchemeType;

  constructor() {
    this.setupForm();
  }

  private compareFormChanges(newValues: FormValues): boolean {
    return deepCompare(this.formValues, newValues);
  }

  private createCateringsFormArray(prices: PricingPrices, ageGroups: PricingAgeGroup[]): FormArray {
    this.cateringIdMap = new Map();
    const cateringsPriceIds = Object.keys(prices).filter(key => prices.hasOwnProperty(key));
    return new FormArray(cateringsPriceIds.map((cateringIdStr, cateringIndex) => {
      this.cateringIdMap.set(cateringIndex, cateringIdStr);
      return this.getOrCreatePersonsFormArray(
        prices,
        +cateringIdStr,
        ageGroups
      );
    }));
  }

  private getOrCreatePersonsFormArray(prices: PricingPrices, cateringId: number, ageGroups: PricingAgeGroup[]): FormGroup {
    const personsPrices = prices[cateringId.toString()];
    const currentFormGroupMap = this.getOrCreateCateringFormGroupMap(cateringId);
    const adultPriceChange: EventEmitter<number> = new EventEmitter();
    adultPriceChange.pipe(untilDestroyed(this)).subscribe(personsNumber => {
      this.recalculateAgeGroupPrices(this.cateringId, personsNumber);
    });
    return new FormGroup({
      persons: new FormArray(personsPrices.map(personPrices => getOrCreatePersonFormGroup(
        currentFormGroupMap,
        personPrices.personsNo,
        personPrices.adultPrice,
        personPrices.ages,
        ageGroups,
        adultPriceChange
      )))
    });
  }

  private getOrCreateCateringFormGroupMap(cateringId: number): pricesFormGroupMap {
    const existingFormGroupMap = this.formGroupMap.get(cateringId);
    if (existingFormGroupMap) {
      return existingFormGroupMap;
    }
    const newMap = new Map<number, PricesFormGroupItem>();
    this.formGroupMap.set(cateringId, newMap);
    return newMap;
  }

  private getPricingAgeGroupControl(cateringId: number, mapId: number, ageGroupId: symbol): FormControl | undefined {
    if (!this.formGroupMap) {
      return undefined;
    }
    const currentFormGroup = this.formGroupMap.get(cateringId);
    if (!currentFormGroup) {
      return undefined;
    }
    const existingFormGroup = currentFormGroup.get(mapId);
    return existingFormGroup ? existingFormGroup.ageGroupPrices.get(ageGroupId) : undefined;
  }

  private markFormAsPristine(): void {
    if (!this.form) {
      return;
    }
    this.form.markAsPristine();
    this.formDirtyChange.emit(this.form.dirty);
  }

  private processFormChanges(values: FormValues): void {
    if (this.compareFormChanges(values)) {
      return;
    }
    this.formValues = values;
    values.caterings.forEach((cateringPrices, cateringIndex) => {
      const cateringId = this.cateringIdMap.get(cateringIndex);
      if (!cateringId) {
        return;
      }
      cateringPrices.persons.forEach((personPrices, personsIndex) => {
        const currentPersons = this.prices && this.prices[cateringId] ? this.prices[cateringId][personsIndex] : undefined;
        if (currentPersons) {
          currentPersons.adultPrice = personPrices.adultPrice;
          personPrices.ageGroupPrices.forEach((price, ageGroupIndex) => {
            const currentAgeGroup = currentPersons.ages[ageGroupIndex];
            if (currentAgeGroup) {
              currentAgeGroup.price = price;
            }
          });
        }
      });
    });
    this.prices = this.prices ? {...this.prices} : undefined;
    this.pricesChange.emit(this.prices);
  }

  private recalculateAgeGroupPrices(onlyCateringId?: number, personsNumber?: number): void {
    if (!this.prices || !isPricingSchemePercentBased(this.pricingScheme)) {
      return;
    }

    Object.keys(this.prices).forEach(cateringIdStr => {
      const cateringId = +cateringIdStr;
      if (!this.prices || !this.prices.hasOwnProperty(cateringIdStr) || (onlyCateringId && onlyCateringId !== cateringId)) {
        return;
      }
      this.recalculateAgeGroupPricesForCatering(cateringId, personsNumber);
    });
  }

  private recalculateAgeGroupPricesForCatering(cateringId: number, personsNumber?: number): void {
    if (!this.prices || !isPricingSchemePercentBased(this.pricingScheme)) {
      return;
    }
    const currentPricesTable = this.prices[cateringId.toString()];
    const defaultPersonPrices = currentPricesTable.find(prices => prices.personsNo === this.stdPricePosition);
    const pricesToUpdate = currentPricesTable.filter(prices => {
      return this.pricingScheme === PricingSchemeType.PercentPerRoom || !personsNumber || personsNumber === prices.personsNo;
    });
    pricesToUpdate.forEach(prices => {
      const personPrices = this.pricingScheme === PricingSchemeType.PercentPerRoom ? defaultPersonPrices : prices;
      const adultPrice = personPrices ? personPrices.adultPrice : 0;
      prices.ages = this.ageGroups.map(ageGroup => {
        const ageGroupControl = this.getPricingAgeGroupControl(cateringId, prices.personsNo, ageGroup.id);
        return mapAgeGroupToEntityAgeGroup(ageGroup, prices.ages, adultPrice, ageGroupControl);
      });
    });
  }

  private selectCurrentPrices(): void {
    if (!this.prices || this.cateringId === undefined) {
      return;
    }
    const cateringIndex = Object.keys(this.prices).findIndex(key => key === this.cateringId.toString());
    if (cateringIndex < 0) {
      this.currentPrices = undefined;
      return;
    }
    this.currentPrices = {
      prices: this.prices[this.cateringId.toString()],
      index: cateringIndex
    };
  }

  private setupForm(): void {
    this.form = new FormGroup({
      caterings: new FormArray([])
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      this.processFormChanges(values);
    });
    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });
    this.formGroupMap = new Map();
  }

  private updateFormValues(): void {
    if (!this.prices || !this.ageGroups) {
      return;
    }
    this.form.setControl('caterings', this.createCateringsFormArray(this.prices, this.ageGroups));
    this.formValues = this.form.value;
  }

  ngOnInit() {
    if (this.formsSaved) {
      this.formsSaved.pipe(untilDestroyed(this)).subscribe(() => {
        this.markFormAsPristine();
      });
    }
  }

  ngOnChanges({ageGroups, cateringId, prices, stdPricePosition}: SimpleChanges): void {
    if ((ageGroups || stdPricePosition) && !prices) {
      this.recalculateAgeGroupPrices();
    }
    if (cateringId) {
      this.focusOnEnterMaps = new Map();
    }
    if (cateringId || prices) {
      this.selectCurrentPrices();
    }
    if (ageGroups || prices) {
      this.updateFormValues();
    }
  }

  ngOnDestroy(): void {}

}

interface FormValues {
  caterings: {
    persons: {
      adultPrice: number,
      ageGroupPrices: number[]
    }[];
  }[];
}
