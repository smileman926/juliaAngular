import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { CacheService } from '@/app/helpers/cache.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-billing-settings',
  templateUrl: './billing-settings.component.pug',
  styleUrls: ['./billing-settings.component.sass']
})
export class SettingsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() top: boolean;

  private params;
  private lastCleanupChargeSeparateSetting?: boolean;
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'General',
        label: 'BackEnd_WikiLanguage.CAT_General',
      },
      {
        id: 'Layout',
        label: 'ebc.invoiceSettings.layout.text',
      },
      {
        id: 'ItemOnInvoice',
        label: 'ebc.invoiceSettings.itemOnTheInvoice.text',
      },
      {
        id: 'Taxes',
        label: 'ebc.invoiceSettings.tax.text',
      },
      {
        id: 'LinkTaxes',
        label: 'ebc.invoiceSettings.taxation.text',
      },
      {
        id: 'InvoiceAddress',
        label: 'ebc.invoiceSettings.invoiceAddress.text',
      },
      {
        id: 'CashRegister',
        label: 'ebc.guestPayment.cashRegister.text',
      },
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'General';
  public selected: string;

  public isLoading: Observable<boolean>;

  constructor(
    private apiBillingWorkbenchService: ApiBillingWorkbenchService,
    private eventBusService: EventBusService,
    private loaderService: LoaderService,
    protected cacheService: CacheService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  private async compareLastCleanupChargeSeparateSetting(): Promise<void> {
    const currentSetting = await this.apiBillingWorkbenchService.getCleanupChargeSeparateSetting().toPromise();
    if (this.lastCleanupChargeSeparateSetting !== undefined && this.lastCleanupChargeSeparateSetting !== currentSetting) {
      sendRoomplanUpdate(this.eventBusService, 'cleanupChargeSeparateChanged');
      sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
    }
    this.lastCleanupChargeSeparateSetting = currentSetting;
  }

  async ngOnInit(): Promise<void> {
    await this.compareLastCleanupChargeSeparateSetting();
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue !== false && top.currentValue === false) {
      this.compareLastCleanupChargeSeparateSetting();
    }
  }

  ngOnDestroy(): void {
    this.compareLastCleanupChargeSeparateSetting();
  }
}
