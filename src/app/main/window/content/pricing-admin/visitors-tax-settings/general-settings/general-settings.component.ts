import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormControl } from '@angular/forms';

import { MainService } from '@/app/main/main.service';
import { VistorsScreenSettings } from '@/app/main/window/content/pricing-admin/visitors-tax-settings/models';

@Component({
  selector: 'app-tax-general-settings',
  templateUrl: './general-settings.component.pug',
  styleUrls: ['./general-settings.component.sass'],
})
export class GeneralSettingsComponent implements OnChanges {
  @Input() items: VistorsScreenSettings;
  @Output() saveEvent = new EventEmitter<VistorsScreenSettings>();

  public taxName: string;
  public lang = new FormControl();
  public languages: { value: string; name: string }[];
  public inclusiveCheck = new FormControl();
  public exclusiveCheck = new FormControl();
  public taxEnabled = new FormControl();
  private selectedLangIndex: number;

  constructor(private mainService: MainService) {
    this.lang.setValue(+this.mainService.getCompanyDetails().c_beLocale_id - 1);
    this.selectedLangIndex =
      +this.mainService.getCompanyDetails().c_beLocale_id - 1;
    this.languages = this.mainService
      .getCompanyDetails()
      .languagesDataProvider.map((l) => ({
        value: l.l_id,
        name: l.l_nameDisplay,
      }));
  }

  public localChange(newValue: number): void {
    this.selectedLangIndex = newValue;
    this.taxName = this.items.locales[this.selectedLangIndex].vtl_value;
  }

  public checkRadio(value: boolean): void {
    if (value === true) {
      this.inclusiveCheck.setValue('inclusive');
      this.items.c_visitorsTaxIncluded = true;
    } else {
      this.inclusiveCheck.setValue('exclusive');
      this.items.c_visitorsTaxIncluded = false;
    }
    this.saveEvent.emit(this.items);
  }

  public checkActive(): void {
    this.items.c_visitorsTaxEnabled = !this.items.c_visitorsTaxEnabled;
    this.saveEvent.emit(this.items);
  }

  public nameChange(value: string): void {
    this.items.locales[this.selectedLangIndex].vtl_value = value;
    this.saveEvent.emit(this.items);
  }

  ngOnChanges({ items }: SimpleChanges): void {
    if (items) {
      this.taxName = this.items.locales[this.selectedLangIndex].vtl_value;
      if (this.items.c_visitorsTaxIncluded) {
        this.inclusiveCheck = new FormControl('inclusive');
        this.exclusiveCheck = new FormControl('exclusive');
      } else {
        this.inclusiveCheck = new FormControl('exclusive');
        this.exclusiveCheck = new FormControl('inclusive');
      }
      if (this.items.c_visitorsTaxEnabled) {
        this.taxEnabled = new FormControl(true);
      } else {
        this.taxEnabled = new FormControl(false);
      }
    }
  }
}
