import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { focusOnEnterMap } from '@/ui-kit/directives/focus-on-enter.directive';
import { deepCompare } from '@/ui-kit/utils/compare';
import { PricingAgeGroup } from '../../../models';

interface FocusOnEnterMaps {
  from: focusOnEnterMap;
  to: focusOnEnterMap;
  discount: focusOnEnterMap;
}

@Component({
  selector: 'app-age-groups',
  templateUrl: './age-groups.component.pug',
  styleUrls: ['./age-groups.component.sass']
})
export class AgeGroupsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ageGroups!: PricingAgeGroup[];
  @Output() ageGroupsChange: EventEmitter<PricingAgeGroup[]> = new EventEmitter();
  @Input() canReset = true;
  @Input() formsSaved!: EventEmitter<void>;
  @Output() addGroup: EventEmitter<void> = new EventEmitter();
  @Output() deleteGroup: EventEmitter<PricingAgeGroup> = new EventEmitter();
  @Output() formDirtyChange: EventEmitter<boolean> = new EventEmitter();
  @Output() resetGroups: EventEmitter<void> = new EventEmitter();

  public form: FormGroup;
  public formGroupMap: Map<symbol, FormGroup>;
  public selectedGroup?: PricingAgeGroup;
  public focusOnEnterMaps: FocusOnEnterMaps = {
    from: new Map(),
    to: new Map(),
    discount: new Map()
  };
  private formGroupIdMap: Map<number, symbol>;
  private formValues: FormValues;
  private selectNewItem = false;

  constructor() {
    this.setupForm();
  }

  public addNewGroup(): void {
    this.selectNewItem = true;
    this.addGroup.emit();
  }

  public deleteSelectedGroup(): void {
    const selectedAgeGroup = this.getAgeGroupById(this.selectedGroup ? this.selectedGroup.id : undefined);
    if (!selectedAgeGroup) {
      return;
    }
    this.deleteGroup.emit(selectedAgeGroup);
  }

  public onFieldBlur(): void {
    this.processFormChanges(this.form.value);
  }

  private compareFormValues(newValues: FormValues): boolean {
    return deepCompare(this.formValues, newValues);
  }

  private getAgeGroupById(id?: symbol): PricingAgeGroup | undefined {
    if (!id) {
      return undefined;
    }
    return this.ageGroups.find(ageGroup => ageGroup.id === id);
  }

  private getAgeGroupByIndex(index: number): PricingAgeGroup | undefined {
    const id = this.formGroupIdMap.get(index);
    if (!id) {
      return undefined;
    }
    return this.ageGroups.find(ageGroup => ageGroup.id === id);
  }

  private getOrCreateFormGroup(ageGroup: PricingAgeGroup): FormGroup {
    const existingFormGroup = this.getFormGroup(ageGroup);
    if (existingFormGroup) {
      return existingFormGroup;
    }
    const newGroup = new FormGroup({
      from: new FormControl(ageGroup.from),
      to: new FormControl(ageGroup.to),
      discount: new FormControl(ageGroup.discount || 0)
    });
    this.setFormGroup(ageGroup, newGroup);
    return newGroup;
  }

  private markFormAsPristine(): void {
    if (!this.form) {
      return;
    }
    this.form.markAsPristine();
    this.formDirtyChange.emit(this.form.dirty);
  }

  private processAgeGroupChanges(ageGroups: SimpleChange): void {
    this.formGroupMap = new Map();
    this.updateAgeGroupsFormArray(ageGroups.currentValue);
    if (this.selectNewItem) {
      this.selectNewItem = false;
      const newItem = findNewItem(ageGroups);
      if (newItem) {
        this.selectedGroup = newItem;
      }
    }
  }

  private processFormChanges(values: FormValues): void {
    if (this.compareFormValues(values)) {
      return;
    }
    this.formValues = values;
    this.formValues.groups.forEach((group, index) => {
      const ageGroup = this.getAgeGroupByIndex(index);
      if (ageGroup) {
        ageGroup.from = group.from;
        ageGroup.to = group.to;
        ageGroup.discount = group.discount;
      }
    });
    this.ageGroupsChange.emit(this.ageGroups);
  }

  private setupForm(): void {
    this.form = new FormGroup({});
    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });
  }

  private updateAgeGroupsFormArray(ageGroups: PricingAgeGroup[]): void {
    this.formGroupIdMap = new Map();
    const formArray = new FormArray([]);
    ageGroups.forEach((ageGroup, index) => {
      this.formGroupIdMap.set(index, ageGroup.id);
      formArray.push(this.getOrCreateFormGroup(ageGroup));
    });
    this.form.setControl('groups', formArray);
  }

  /** region form group map management */
  private getFormGroup(ageGroup: PricingAgeGroup): FormGroup | undefined {
    return this.formGroupMap.get(ageGroup.id);
  }

  private setFormGroup(ageGroup: PricingAgeGroup, control: FormGroup): void {
    this.formGroupMap.set(ageGroup.id, control);
  }
  /** endregion */

  ngOnInit(): void {
    if (this.formsSaved) {
      this.formsSaved.pipe(untilDestroyed(this)).subscribe(() => {
        this.markFormAsPristine();
      });
    }
  }

  ngOnChanges({ageGroups}: SimpleChanges): void {
    if (ageGroups) {
      this.processAgeGroupChanges(ageGroups);
    }
  }

  ngOnDestroy(): void {}
}

interface FormValues {
  groups: {from: number, to: number, discount: number}[];
}

function findNewItem(ageGroups: SimpleChange): PricingAgeGroup | undefined {
  if (!ageGroups.currentValue) {
    return undefined;
  }
  if (!ageGroups.previousValue) {
    return ageGroups.currentValue[0];
  }
  return ageGroups.currentValue.find(currentAgeGroup => {
    return !ageGroups.previousValue.find(previousAgeGroup => previousAgeGroup.id === currentAgeGroup.id);
  });
}
