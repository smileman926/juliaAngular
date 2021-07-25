import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'getCateringFormControl'
})
export class GetCateringFormControlPipe implements PipeTransform {

  transform(
    formGroup: FormGroup,
    cateringIndex: number,
    ageGroupIndex?: number
  ): FormControl | undefined {
    if (!formGroup) {
      return;
    }
    const formArray = formGroup.get('caterings') as FormArray;
    if (!formArray) {
      return undefined;
    }
    const cateringGroup = formArray.at(cateringIndex) as FormGroup;
    if (!cateringGroup) {
      return undefined;
    }
    if (ageGroupIndex === undefined) {
      return cateringGroup.get('adultPrice') as FormControl;
    }
    const ageGroupsArray = cateringGroup.get('ageGroupPrices') as FormArray;
    if (!ageGroupsArray) {
      return undefined;
    }
    return ageGroupsArray.at(ageGroupIndex) as FormControl;
  }

}
