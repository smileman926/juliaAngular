import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { deepCompare } from '@/ui-kit/utils/compare';
import {
  ageGroupFocusOnEnterMap,
  CateringEntity,
  PricesFormGroupItem,
  PricingAgeGroup,
  ServiceType
} from '../../../models';
import { mapAgeGroupToEntityAgeGroup } from '../../../utils';
import { getOrCreateCateringFormGroup } from '../create-form-group';

@Component({
  selector: 'app-catering-prices',
  templateUrl: './catering-prices.component.pug',
  styleUrls: ['./catering-prices.component.sass']
})
export class CateringPricesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() caterings?: CateringEntity[];
  @Output() cateringsChange: EventEmitter<CateringPricesComponent['caterings']> = new EventEmitter<CateringPricesComponent['caterings']>();
  @Input() ageGroups: PricingAgeGroup[];
  @Input() cateringTypes: ServiceType[];
  @Input() cateringOutOfRoomPrice!: boolean;
  @Input() formsSaved!: EventEmitter<void>;
  @Input() otherCateringRelative!: boolean;
  @Output() formDirtyChange: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;
  public displayPriceControl: FormControl;
  public displayPriceId: number | undefined;
  public focusOnEnterMaps: ageGroupFocusOnEnterMap;
  private formGroupMap: Map<number, PricesFormGroupItem>;
  private formValues?: FormValues;

  constructor() {
    this.focusOnEnterMaps = new Map();
    this.setupForm();
  }

  private compareFormChanges(newValues: FormValues): boolean {
    return deepCompare(this.formValues, newValues);
  }

  private createCateringsFormArray(
    caterings: CateringEntity[],
    ageGroups: PricingAgeGroup[]
  ): FormArray {
    const adultPriceChange: EventEmitter<number> = new EventEmitter();
    adultPriceChange.pipe(untilDestroyed(this)).subscribe(personsNumber => this.recalculateAgeGroupPrices(personsNumber));
    return new FormArray(caterings.map(catering => getOrCreateCateringFormGroup(
      this.formGroupMap,
      catering.typeId,
      catering.adultPrice,
      catering.active,
      catering.ages,
      ageGroups,
      adultPriceChange
    )));
  }

  private getPricingAgeGroupControl(catering: CateringEntity, ageGroupId: symbol): FormControl | undefined {
    if (!this.formGroupMap) {
      return undefined;
    }
    const existingFormGroup = this.formGroupMap.get(catering.typeId);
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
    this.displayPriceId = values.displayPrice ? +values.displayPrice : undefined;
    values.caterings.forEach((catering, cateringIndex) => {
      const currentCatering = this.caterings ? this.caterings[cateringIndex] : undefined;
      if (currentCatering) {
        currentCatering.active = catering.active;
        currentCatering.adultPrice = catering.adultPrice;
        catering.ageGroupPrices.forEach((price, ageGroupIndex) => {
          const currentAgeGroup = currentCatering.ages[ageGroupIndex];
          if (currentAgeGroup) {
            currentAgeGroup.price = price;
          }
        });
      }
    });
    this.caterings = this.caterings ? [...this.caterings] : undefined;
    this.cateringsChange.emit(this.caterings);
  }

  private recalculateAgeGroupPrices(onlyCateringId?: number): void {
    if (!this.caterings) {
      return;
    }
    const cateringsToUpdate = this.caterings.filter(catering => !onlyCateringId || catering.typeId === onlyCateringId);
    cateringsToUpdate.forEach(catering => {
      const adultPrice = catering.adultPrice || 0;
      catering.ages = this.ageGroups.map(ageGroup => {
        const ageGroupControl = this.getPricingAgeGroupControl(catering, ageGroup.id);
        return mapAgeGroupToEntityAgeGroup(ageGroup, catering.ages, adultPrice, ageGroupControl);
      });
    });
  }

  private setupForm(): void {
    this.formValues = undefined;
    this.formGroupMap = new Map();
    this.displayPriceControl = new FormControl(null);
    this.form = new FormGroup({
      displayPrice: this.displayPriceControl,
      caterings: new FormArray([])
    });
    this.displayPriceControl.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if (this.caterings) {
        this.caterings.forEach(catering => {
          catering.stdDisplayPrice = catering.typeId === value;
        });
      }
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      this.processFormChanges(values);
    });
    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });
  }

  private updateFormValues(): void {
    const caterings = this.caterings || [];
    const displayPriceGroup = caterings.find(catering => catering.stdDisplayPrice);
    const displayPriceGroupId = displayPriceGroup ? displayPriceGroup.typeId : null;
    this.displayPriceControl.setValue(displayPriceGroupId, {emitEvent: false});
    this.form.setControl('caterings', this.createCateringsFormArray(caterings, this.ageGroups || []));
    this.formValues = this.form.value;
  }

  ngOnInit(): void {
    if (this.formsSaved) {
      this.formsSaved.pipe(untilDestroyed(this)).subscribe(() => {
        this.markFormAsPristine();
      });
    }
  }

  ngOnChanges({ageGroups, caterings}: SimpleChanges): void {
    if (ageGroups && !ageGroups.firstChange) {
      this.recalculateAgeGroupPrices();
    }
    if (ageGroups || caterings) {
        this.updateFormValues();
    }
  }

  ngOnDestroy() {}
}

interface FormValues {
  displayPrice?: number;
  caterings: {
    active: boolean,
    adultPrice: number,
    ageGroupPrices: number[]
  }[];
}
