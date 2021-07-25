import { Component, OnDestroy, OnInit } from '@angular/core';

import _ from 'lodash';
import { Observable } from 'rxjs';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { TranslateService } from '@ngx-translate/core';

import { ApiVisitorsTaxSettingsService } from '@/app/helpers/api/api-visitors-tax-settings.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';

import {
  VisitorTaxItem,
  VistorsScreenSettings,
} from '@/app/main/window/content/pricing-admin/visitors-tax-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

enum LoaderType {
  LOAD = 'load-visitor-tax-details',
}

@Component({
  selector: 'app-visitors-tax-settings',
  templateUrl: './visitors-tax-settings.component.pug',
  styleUrls: ['./visitors-tax-settings.component.sass'],
})
export class VisitorsTaxSettingsComponent implements OnInit, OnDestroy {
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'general',
        label: 'General',
      },
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'general';
  public selectedItemId: VisitorTaxItem['vt_id'] | null;
  public itemIdField = 'vt_id';
  public items: VistorsScreenSettings;
  public isLoading: Observable<boolean>;
  public detailData: { items: VistorsScreenSettings; selectedUser: number };
  public activeUserNum: number;
  public generalSaveData: VistorsScreenSettings;
  public isItemExist = true;

  constructor(
    private apiVisitorsTaxSettingsService: ApiVisitorsTaxSettingsService,
    private ebDate: EbDatePipe,
    private loaderService: LoaderService,
    private translateService: TranslateService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  public onSaveRequest(): void {
    this.refresh();
  }

  public selectUser(id: string): void {
    this.selectedItemId = id;
    const index = this.items.visitorsTax.findIndex((item) => item.vt_id === id);
    this.detailData = { items: this.items, selectedUser: index };
  }

  public setGeneralSetting(items: VistorsScreenSettings) {
    this.generalSaveData = _.cloneDeep(items);
  }

  public getUserLabel(item: VisitorTaxItem): string {
    const from = this.ebDate.transform(new Date(item.vt_fromDate), false);
    const to = this.ebDate.transform(new Date(item.vt_untilDate), false);

    return `${from} - ${to}, ${item.vt_name}`;
  }

  @Loading(LoaderType.LOAD)
  public async addNewTaxInfo(): Promise<void> {
    let newItem: VisitorTaxItem;
    newItem = {
      vt_id: '0',
      vt_name: await this.translateService
        .get('BackEnd_WikiLanguage.generic_New')
        .toPromise(),
      vt_fromDate: new Date().toISOString().slice(0, 10),
      vt_untilDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().slice(0, 10),
      ageGroupDetails: [
        {
          vtd_id: '0',
          vtd_from: '0',
          vtd_until: null,
          vtd_value: null,
        },
      ],
      vt_visitorsTaxChargeType_id: '1',
      vt_visitorsTaxCalculationRule_id: '2',
    };
    this.items.visitorsTax.push(newItem);
    await this.apiVisitorsTaxSettingsService
      .postVisitorsTaxScreenSettings({ visitorsTax: this.items.visitorsTax })
      .toPromise();
    this.refresh();
  }

  @Loading(LoaderType.LOAD)
  public async deleteSelectedTaxInfo(): Promise<void> {
    await this.apiVisitorsTaxSettingsService
      .deleteVisitorsTaxScreenSettings({ vt_id: this.selectedItemId })
      .toPromise();
    this.items.visitorsTax.splice(this.activeUserNum, 1);
    this.refresh();
    if (this.items.visitorsTax.length > 0) {
      this.selectedItemId = this.items.visitorsTax[0].vt_id;
    }
  }

  @Loading(LoaderType.LOAD)
  public async refresh(): Promise<void> {
    this.items = await this.apiVisitorsTaxSettingsService
      .getVisitorsTaxScreenSettings({})
      .toPromise();
    this.generalSaveData = _.cloneDeep(this.items);
    if (this.items.visitorsTax.length > 0) {
      this.isItemExist = true;
    } else {
      this.selectedItemId = null;
      this.isItemExist = false;
    }

    if (this.selectedItemId) {
      const index = this.items.visitorsTax.findIndex(
        (item) => item.vt_id === this.selectedItemId
      );
      this.detailData = { items: this.items, selectedUser: index };
    }
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {}
}
