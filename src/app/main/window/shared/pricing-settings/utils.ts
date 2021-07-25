import { FormControl } from '@angular/forms';

import { FormOption } from '@/app/main/shared/form-data.service';
import { PricingAgeGroup, PricingEntity, PricingEntityAgeGroup, PricingSchemeType } from './models';

export function calculateAdultsPrice(ages: PricingEntity['ages']) {
    const ageRange = ages.find((rule) => rule.from === 18);

    return ageRange ? ageRange.price : 0;
}

function getOrCreateEntityAgeGroup(
  ageGroup: PricingAgeGroup,
  existingEntityAgeGroups: PricingEntityAgeGroup[]
): PricingEntityAgeGroup {
  const existingAgeGroup = existingEntityAgeGroups.find(entityAgeGroup => entityAgeGroup.id === ageGroup.id);
  if (existingAgeGroup) {
    existingAgeGroup.from = ageGroup.from;
    existingAgeGroup.to = ageGroup.to;
    return existingAgeGroup;
  }
  return {
    id: ageGroup.id,
    from: ageGroup.from,
    to: ageGroup.to,
    price: 0
  };
}

export function mapAgeGroupToEntityAgeGroup(
  ageGroup: PricingAgeGroup,
  existingEntityAgeGroups: PricingEntityAgeGroup[],
  adultPrice: number,
  ageGroupControl?: FormControl
): PricingEntityAgeGroup {
  const discount = ageGroup ? ageGroup.discount : 0;
  const entityAgeGroup = getOrCreateEntityAgeGroup(ageGroup, existingEntityAgeGroups);
  entityAgeGroup.price = adultPrice * (100 - discount) / 100;
  if (ageGroupControl) {
    ageGroupControl.setValue(entityAgeGroup.price, {emitEvent: false});
  }
  return entityAgeGroup;
}

export function getPricingSchemeType(pricingSchemeId: number, pricingSchemes: FormOption[]): PricingSchemeType | undefined {
  const pricingScheme = pricingSchemes.find(scheme => +scheme.value === pricingSchemeId);
  if (!pricingScheme) {
    return undefined;
  }
  return pricingScheme.name as PricingSchemeType;
}

export function isPricingSchemePercentBased(pricingSchemeType?: PricingSchemeType): boolean {
  if (!pricingSchemeType) {
    return false;
  }
  return [PricingSchemeType.PercentPerRoom, PricingSchemeType.PercentPerPerson].includes(pricingSchemeType);
}
