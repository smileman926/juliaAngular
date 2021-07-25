import { GlobalLoaderTypes } from '@/app/shared/loader-types';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';

import { MainService } from '@/app/main/main.service';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { PricingSource } from '../../models';
import { PricesMainTabService } from './prices-main-tab.service';

@Component({
  selector: 'app-prices-main-tab',
  templateUrl: './prices-main-tab.component.pug',
  styleUrls: ['./prices-main-tab.component.sass'],
  providers: [PricesMainTabService]
})
export class PricesMainTabComponent implements OnChanges, OnDestroy {

  @Input() source!: PricingSource;
  @Input() period!: SeasonPeriod;
  @Input() hasCaterings!: boolean;
  @Input() canResetGroups!: boolean;
  @Input() canSaveForAll!: boolean;
  @Input() extraActionsTemplate!: any;
  @Input() additionalInfoTemplate!: any;
  @Output() saved: EventEmitter<void>;

  public isLoading: Observable<boolean>;
  public isPricingLoading: Observable<boolean>;

  constructor(
    public pricesMainTabService: PricesMainTabService,
    private mainService: MainService,
    private loaderService: LoaderService,
  ) {
    this.saved = this.pricesMainTabService.saved;
    this.isLoading = this.loaderService.isLoadingAnyOf([LoaderType.Pricing, GlobalLoaderTypes.CompanySettings]);
    this.isPricingLoading = this.loaderService.isLoading(LoaderType.LoadPricing);
  }

  ngOnChanges({ period, source, pricingSchemeId }: SimpleChanges): void {
    if (
      (period && period.currentValue !== period.previousValue) ||
      (source && source.currentValue !== source.previousValue)
    ) {
      this.pricesMainTabService.loadPricing(this.source, this.period).catch();
    }
  }

  ngOnDestroy(): void {}
}
