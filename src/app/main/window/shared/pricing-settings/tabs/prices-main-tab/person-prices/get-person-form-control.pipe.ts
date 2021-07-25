import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'getPersonFormControl'
})
export class GetPersonFormControlPipe implements PipeTransform {

  transform(
    formGroup: FormGroup,
    cateringIndex: number,
    personsIndex: number,
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
    const personsArray = cateringGroup.get('persons') as FormArray;
    if (!personsArray) {
      return undefined;
    }
    const personGroup = personsArray.at(personsIndex) as FormGroup;
    if (!personGroup) {
      return undefined;
    }
    if (ageGroupIndex === undefined) {
      return personGroup.get('adultPrice') as FormControl;
    }
    const ageGroupsArray = personGroup.get('ageGroupPrices') as FormArray;
    if (!ageGroupsArray) {
      return undefined;
    }
    return ageGroupsArray.at(ageGroupIndex) as FormControl;
  }

}
