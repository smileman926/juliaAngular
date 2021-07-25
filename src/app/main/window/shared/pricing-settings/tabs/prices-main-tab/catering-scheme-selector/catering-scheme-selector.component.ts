import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { FormOption } from '@/app/main/shared/form-data.service';
import { CateringEntity } from '../../../models';

@Component({
  selector: 'app-catering-scheme-selector',
  templateUrl: './catering-scheme-selector.component.pug',
  styleUrls: ['./catering-scheme-selector.component.sass']
})
export class CateringSchemeSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() cateringId!: number;
  @Output() cateringIdChange: EventEmitter<number> = new EventEmitter();
  @Input() caterings!: CateringEntity[];
  @Input() formsSaved!: EventEmitter<void>;
  @Input() pricingSchemeId!: number;
  @Output() pricingSchemeIdChange: EventEmitter<number> = new EventEmitter();
  @Input() pricingSchemes!: FormOption[];
  @Input() showCateringDropdown: boolean;
  @Output() formDirtyChange: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  constructor() {}

  public onDisplayCateringChange(value: string): void {
    this.cateringId = +value;
    this.cateringIdChange.emit(this.cateringId);
  }

  private markFormAsPristine(): void {
    if (!this.form) {
      return;
    }
    this.form.markAsPristine();
    this.formDirtyChange.emit(this.form.dirty);
  }

  private setupForm(): void {
    const pricingSchemeId = new FormControl(this.pricingSchemeId);
    this.form = new FormGroup({
      pricingSchemeId
    });
    pricingSchemeId.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.pricingSchemeId = +value;
      this.pricingSchemeIdChange.emit(this.pricingSchemeId);
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

  ngOnChanges({cateringId}: SimpleChanges) {
    if (cateringId) {

    }
  }

  ngOnDestroy(): void {}

}
