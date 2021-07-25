import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import _ from 'lodash';

import { ApiVisitorsTaxSettingsService } from '@/app/helpers/api/api-visitors-tax-settings.service';
import { FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { stringifyDate } from '@/app/helpers/date';

import {
  AgeGroupItem,
  VisitorTaxItem,
  VistorsScreenSettings,
} from '@/app/main/window/content/pricing-admin/visitors-tax-settings/models';

enum LoaderType {
  LOAD = 'load-visitor-tax-details',
}

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.component.pug',
  styleUrls: ['./tax-detail.component.sass'],
})
export class TaxDetailComponent implements OnInit, OnChanges {
  @Input() list: { items: VistorsScreenSettings; selectedUser: number };
  @Input() settingChange: VistorsScreenSettings;
  @Output() saveEvent = new EventEmitter();

  public form: FormGroup;
  public languages: FormOption[];
  public showItems = 0;
  public visitorsTaxData: VisitorTaxItem;
  public inputPlaceholder: string | null = '0 - 18';
  public isLoading: Observable<boolean>;
  public removeAgeGroupIdArray: string[] = [];
  public disableStatus: boolean;
  public ageType: boolean;
  public displayDetails = new Set<number>();
  public taxChargeTypeValue: boolean;
  public saveValidation = false;
  public yearCalcMin: number;
  public yearCalcMax: number;

  constructor(
    private apiVisitorsTaxSettingsService: ApiVisitorsTaxSettingsService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  getStartAgeGroup(): FormArray {
    return this.form.get('startAgeGroup') as FormArray;
  }

  getUntilAgeGroup(): FormArray {
    return this.form.get('untilAgeGroup') as FormArray;
  }

  getAmountGroup(): FormArray {
    return this.form.get('amountGroup') as FormArray;
  }

  getYearFrom(): FormArray {
    return this.form.get('yearFrom') as FormArray;
  }

  public changeAgeType(value: string): void {
    this.reset(value);
    if (value === '2') {
      this.inputPlaceholder = '0 - 18';
      this.ageType = false;
    } else {
      this.ageType = true;
      this.inputPlaceholder = String(this.yearCalcMax);
    }
  }

  public addNewRow(): void {
    this.getStartAgeGroup().push(new FormControl());
    this.getUntilAgeGroup().push(new FormControl());
    this.getAmountGroup().push(new FormControl());
    this.getYearFrom().push(new FormControl());
    this.showItems++;
    this.visitorsTaxData.ageGroupDetails.push({
      vtd_id: '0',
      vtd_from: null,
      vtd_until: null,
      vtd_value: null,
    });
    this.checkValidation();
  }

  public removeRow(): void {
    if (this.visitorsTaxData.ageGroupDetails.length >= this.showItems) {
      this.removeAgeGroupIdArray.push(
        this.visitorsTaxData.ageGroupDetails[this.showItems - 1] &&
          this.visitorsTaxData.ageGroupDetails[this.showItems - 1].vtd_id &&
          this.visitorsTaxData.ageGroupDetails[this.showItems - 1].vtd_id
      );
    }
    this.visitorsTaxData.ageGroupDetails.pop();
    this.removeAgeGroupIdArray.filter((item) => item !== undefined);
    this.getStartAgeGroup().removeAt(this.showItems - 1);
    this.getUntilAgeGroup().removeAt(this.showItems - 1);
    this.getAmountGroup().removeAt(this.showItems - 1);
    this.getYearFrom().removeAt(this.showItems - 1);
    this.showItems--;
    this.checkValidation();
  }

  public init(): void {
    this.disableStatus = true;
    this.saveValidation = false;
    this.form = new FormGroup({
      description: new FormControl(),
      fromDate: new FormControl(),
      untilDate: new FormControl(),
      taxChargeType: new FormControl(),
      groupSelection: new FormControl(),
      startAgeGroup: new FormArray([]),
      untilAgeGroup: new FormArray([]),
      amountGroup: new FormArray([]),
      yearFrom: new FormArray([]),
    });
    (this.form.get('taxChargeType') as FormControl).disable();
    (this.form.get('groupSelection') as FormControl).disable();
    const today = new Date();
    this.yearCalcMax = today.getUTCFullYear();
    this.yearCalcMin = today.getUTCFullYear() - 19;
  }

  public reset(value: string): void {
    this.visitorsTaxData = _.cloneDeep(
      this.list.items.visitorsTax[this.list.selectedUser]
    );
    const index = this.visitorsTaxData.ageGroupDetails.findIndex(
      (item) => item.vtd_until === null
    );
    if (index >= 0) {
      this.visitorsTaxData.ageGroupDetails.unshift(
        this.visitorsTaxData.ageGroupDetails[index]
      );
      this.visitorsTaxData.ageGroupDetails.splice(index, 1);
    }
    this.showItems = this.visitorsTaxData.ageGroupDetails.length;
    this.form = new FormGroup({
      description: new FormControl(this.visitorsTaxData.vt_name),
      fromDate: new FormControl(
        this.visitorsTaxData.vt_fromDate,
        Validators.required
      ),
      untilDate: new FormControl(
        this.visitorsTaxData.vt_untilDate,
        Validators.required
      ),
      taxChargeType: new FormControl(
        this.list.items.visitorsTaxChargeType[
          Number(this.visitorsTaxData.vt_visitorsTaxChargeType_id) - 1
        ].vtct_id
      ),
      groupSelection:
        value === ''
          ? new FormControl(
              this.visitorsTaxData.vt_visitorsTaxCalculationRule_id
            )
          : new FormControl(value),
      startAgeGroup:
        this.visitorsTaxData.vt_visitorsTaxCalculationRule_id === '2'
          ? new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl(item.vtd_from, [
                  Validators.min(0),
                  Validators.max(18),
                ]);
              })
            )
          : new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl();
              })
            ),
      untilAgeGroup:
        this.visitorsTaxData.vt_visitorsTaxCalculationRule_id === '2'
          ? new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl(item.vtd_until, [
                  Validators.min(0),
                  Validators.max(18),
                ]);
              })
            )
          : new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl();
              })
            ),
      amountGroup: new FormArray(
        this.visitorsTaxData.ageGroupDetails.map((item) => {
          return new FormControl(item.vtd_value);
        })
      ),
      yearFrom:
        this.visitorsTaxData.vt_visitorsTaxCalculationRule_id === '1'
          ? new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl(item.vtd_from, [
                  Validators.min(this.yearCalcMin),
                  Validators.max(this.yearCalcMax),
                ]);
              })
            )
          : new FormArray(
              this.visitorsTaxData.ageGroupDetails.map((item) => {
                return new FormControl();
              })
            ),
    });
    this.removeAgeGroupIdArray = [];
    this.checkValidation();
  }

  @Loading(LoaderType.LOAD)
  private async saveData(): Promise<void> {
    const ageGroup: AgeGroupItem[] = [];
    for (let i = 0; i < this.showItems; i++) {
      if ((this.form.get('groupSelection') as FormControl).value === '2') {
        ageGroup.push({
          vtd_id: this.visitorsTaxData.ageGroupDetails[i]
            ? this.visitorsTaxData.ageGroupDetails[i].vtd_id
            : '0',
          vtd_from: (this.form.get('startAgeGroup') as FormArray).value[i],
          vtd_until: (this.form.get('untilAgeGroup') as FormArray).value[i],
          vtd_value: Number(
            (this.form.get('amountGroup') as FormArray).value[i]
          ),
        });
      } else {
        ageGroup.push({
          vtd_id: this.visitorsTaxData.ageGroupDetails[i]
            ? this.visitorsTaxData.ageGroupDetails[i].vtd_id
            : '0',
          vtd_from: (this.form.get('yearFrom') as FormArray).value[i],
          vtd_until: null,
          vtd_value: Number(
            (this.form.get('amountGroup') as FormArray).value[i]
          ),
        });
      }
    }
    this.visitorsTaxData = {
      vt_name: (this.form.get('description') as FormControl).value,
      vt_id: this.visitorsTaxData.vt_id,
      vt_fromDate: stringifyDate((this.form.get('fromDate') as FormControl).value as Date).slice(0, 10),
      vt_untilDate: stringifyDate((this.form.get('untilDate') as FormControl).value as Date).slice(0, 10),
      ageGroupDetails: ageGroup,
      vt_visitorsTaxCalculationRule_id: (this.form.get(
        'groupSelection'
      ) as FormControl).value,
      vt_visitorsTaxChargeType_id: (this.form.get(
        'taxChargeType'
      ) as FormControl).value,
    };
    this.removeAgeGroupIdArray.map((item) => {
      this.visitorsTaxData.ageGroupDetails.push({
        vtd_id: '-' + item,
        vtd_from: null,
        vtd_until: null,
        vtd_value: 0,
      });
    });
    this.list.items.visitorsTax[this.list.selectedUser] = _.cloneDeep(
      this.visitorsTaxData
    );

    await this.apiVisitorsTaxSettingsService
      .postVisitorsTaxScreenSettings({
        visitorsTax: this.list.items.visitorsTax,
        locales: this.settingChange.locales,
        c_visitorsTaxEnabled: this.settingChange.c_visitorsTaxEnabled,
        c_visitorsTaxIncluded: this.settingChange.c_visitorsTaxIncluded,
      })
      .toPromise();
    this.saveEvent.emit();
  }

  public checkValidation(): void {
    let status = false;
    if ((this.form.get('groupSelection') as FormControl).value === '2') {
      for (let i = 0; i < this.showItems; i++) {
        if (
          i === 0 &&
          (Number((this.form.get('startAgeGroup') as FormArray).value[i]) >
            18 ||
            Number((this.form.get('startAgeGroup') as FormArray).value[i]) <
              0 ||
            (this.form.get('startAgeGroup') as FormArray).value[i] === null)
        ) {
          status = true;
        }
        if (
          (Number((this.form.get('startAgeGroup') as FormArray).value[i]) < 0 ||
            Number((this.form.get('startAgeGroup') as FormArray).value[i]) >
              18 ||
            Number((this.form.get('untilAgeGroup') as FormArray).value[i]) >
              18 ||
            Number((this.form.get('untilAgeGroup') as FormArray).value[i]) <
              0) &&
          i > 0
        ) {
          status = true;
        }
        if (
          (Number((this.form.get('startAgeGroup') as FormArray).value[i]) >=
            Number((this.form.get('untilAgeGroup') as FormArray).value[i]) ||
            (this.form.get('startAgeGroup') as FormArray).value[i] === null ||
            (this.form.get('untilAgeGroup') as FormArray).value[i] === null) &&
          i > 0
        ) {
          status = true;
        }
      }
    } else {
      for (let i = 0; i < this.showItems; i++) {
        if (
          Number((this.form.get('yearFrom') as FormArray).value[i]) <
            this.yearCalcMin ||
          Number((this.form.get('yearFrom') as FormArray).value[i]) >
            this.yearCalcMax ||
          (this.form.get('yearFrom') as FormArray).value[i] === null
        ) {
          status = true;
        }
      }
    }
    this.saveValidation = status;
  }

  changeTaxChargeType(value: string): void {
    if (value === '1') {
      this.taxChargeTypeValue = false;
    } else {
      this.taxChargeTypeValue = true;
    }
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges({ list, settingChange }: SimpleChanges): void {
    if (list && list.currentValue) {
      this.disableStatus = false;
      (this.form.get('taxChargeType') as FormControl).enable();
      (this.form.get('groupSelection') as FormControl).enable();
      this.reset('');
      if (this.visitorsTaxData.vt_visitorsTaxChargeType_id === '1') {
        this.taxChargeTypeValue = false;
      } else {
        this.taxChargeTypeValue = true;
      }
      this.removeAgeGroupIdArray = [];
      if (this.visitorsTaxData.vt_visitorsTaxCalculationRule_id === '1') {
        this.ageType = true;
      } else {
        this.ageType = false;
      }
      this.inputPlaceholder = '0 - 18';
      this.checkValidation();
    }
  }
}
