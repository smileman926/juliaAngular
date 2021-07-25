import { EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import {
  PricesFormGroupItem,
  PricingAgeGroup,
  PricingEntityAgeGroup
} from '@/app/main/window/shared/pricing-settings/models';

export function getOrCreatePersonFormGroup(
  formGroupMap: Map<number, PricesFormGroupItem>,
  mapId: number,
  price: number,
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroups: PricingAgeGroup[],
  adultPriceChange: EventEmitter<number>
): FormGroup {
  const existingFormGroup = formGroupMap.get(mapId);
  const {formGroupItem, formArray} = createFormGroup(mapId, price, entityAgeGroups, ageGroups, adultPriceChange, existingFormGroup);
  formGroupMap.set(mapId, formGroupItem);
  return new FormGroup({
    adultPrice: formGroupItem.adultPrice,
    ageGroupPrices: formArray
  });
}

export function getOrCreateCateringFormGroup(
  formGroupMap: Map<number, PricesFormGroupItem>,
  mapId: number,
  price: number,
  isActive: boolean,
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroups: PricingAgeGroup[],
  adultPriceChange: EventEmitter<number>
): FormGroup {
  const existingFormGroup = formGroupMap.get(mapId);
  const existingActiveControl = existingFormGroup ? existingFormGroup.active : undefined;
  const active = existingActiveControl || new FormControl(isActive);
  const {formGroupItem, formArray} = createFormGroup(mapId, price, entityAgeGroups, ageGroups, adultPriceChange, existingFormGroup);
  formGroupMap.set(mapId, formGroupItem);
  return new FormGroup({
    active,
    adultPrice: formGroupItem.adultPrice,
    ageGroupPrices: formArray
  });
}

function createFormGroup(
  mapId: number,
  price: number,
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroups: PricingAgeGroup[],
  adultPriceChange: EventEmitter<number>,
  existingFormGroup?: PricesFormGroupItem
): {formGroupItem: PricesFormGroupItem, formArray: FormArray} {
  const adultPrice = existingFormGroup
    ? existingFormGroup.adultPrice
    : createAdultPriceControl(mapId, price, adultPriceChange);
  const ageGroupPrices = getOrCreateAgeGroupPricesArray(entityAgeGroups, ageGroups, existingFormGroup);
  const formGroupItem: PricesFormGroupItem = {
    adultPrice, ageGroupPrices: ageGroupPrices.map
  };
  return {formGroupItem, formArray: ageGroupPrices.formArray};
}

function createAdultPriceControl(mapId: number, value: number, adultPriceChange: EventEmitter<number>): FormControl {
  const control = new FormControl(value);
  control.valueChanges.subscribe(() => {
    adultPriceChange.emit(mapId);
  });
  return control;
}

function getOrCreateAgeGroupPricesArray(
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroups: PricingAgeGroup[],
  existingFormGroup?: PricesFormGroupItem
): {map: Map<symbol, FormControl>, formArray: FormArray} {
  const map: Map<symbol, FormControl> = new Map();
  const formArray: FormArray = new FormArray(ageGroups.map(ageGroup => {
    const formControl = getOrCreateAgeGroupPriceControl(entityAgeGroups, ageGroup, existingFormGroup);
    map.set(ageGroup.id, formControl);
    return formControl;
  }));
  return {map, formArray};
}

function getOrCreateAgeGroupPriceControl(
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroup: PricingAgeGroup,
  formGroup?: PricesFormGroupItem
): FormControl {
  const existingFormControl = formGroup ? formGroup.ageGroupPrices.get(ageGroup.id) : undefined;
  if (existingFormControl) {
    return existingFormControl;
  }
  const currentAgeGroup = entityAgeGroups.find(cateringAgeGroup => {
    return cateringAgeGroup.from === ageGroup.from && cateringAgeGroup.to === ageGroup.to;
  });
  return new FormControl(currentAgeGroup ? currentAgeGroup.price : 0);
}
