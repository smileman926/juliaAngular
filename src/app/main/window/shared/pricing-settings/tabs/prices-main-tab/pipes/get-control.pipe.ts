import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { PricingAgeGroup } from '@/app/main/window/shared/pricing-settings/models';

@Pipe({
  name: 'getControl'
})
export class GetControlPipe implements PipeTransform {

  transform(formGroupMap: Map<symbol, FormGroup>, ageGroup: PricingAgeGroup, name: string): FormControl | undefined {
    if (!formGroupMap || !ageGroup || !name) {
      return undefined;
    }
    const formGroup = formGroupMap.get(ageGroup.id);
    if (!formGroup) {
      return undefined;
    }
    return formGroup.get(name) as FormControl;
  }

}
