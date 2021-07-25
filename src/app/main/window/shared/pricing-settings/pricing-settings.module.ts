import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { AutoSizeInputModule } from 'ngx-autosize-input';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { PeriodConfigModule } from '../period-config/period-config.module';
import { TableModule } from '../table/table.module';
import { PricesComponent } from './prices.component';
import { ConfigurationTabComponent } from './tabs/prices-configuration-tab/prices-configuration-tab.component';
import { AgeGroupsComponent } from './tabs/prices-main-tab/age-groups/age-groups.component';
import { CateringPricesComponent } from './tabs/prices-main-tab/catering-prices/catering-prices.component';
import { GetCateringFormControlPipe } from './tabs/prices-main-tab/catering-prices/get-catering-form-control.pipe';
import { PercentageCalculatedPipe } from './tabs/prices-main-tab/catering-prices/percentage-calculated.pipe';
import { CateringSchemeSelectorComponent } from './tabs/prices-main-tab/catering-scheme-selector/catering-scheme-selector.component';
import { GetPersonFormControlPipe } from './tabs/prices-main-tab/person-prices/get-person-form-control.pipe';
import { IsPersonHighlightedPipe } from './tabs/prices-main-tab/person-prices/is-person-highlighted.pipe';
import { PersonPricesComponent } from './tabs/prices-main-tab/person-prices/person-prices.component';
import { AgeGroupFormatPipe } from './tabs/prices-main-tab/pipes/age-group-format.pipe';
import { CateringNamePipe } from './tabs/prices-main-tab/pipes/catering-name.pipe';
import { FilterPricesPipe } from './tabs/prices-main-tab/pipes/filter-prices.pipe';
import { GetControlPipe } from './tabs/prices-main-tab/pipes/get-control.pipe';
import { GetFocusOnEnterMapPipe } from './tabs/prices-main-tab/pipes/get-focus-on-enter-map.pipe';
import { GetPricingSchemeTypePipe } from './tabs/prices-main-tab/pipes/get-pricing-scheme-type.pipe';
import { PricesMainTabComponent } from './tabs/prices-main-tab/prices-main-tab.component';
import { SettingsComponent } from './tabs/prices-main-tab/settings/settings.component';

@NgModule({
  declarations: [
    PricesComponent,
    ConfigurationTabComponent,
    PricesMainTabComponent,
    AgeGroupFormatPipe,
    CateringPricesComponent,
    CateringNamePipe,
    GetCateringFormControlPipe,
    PercentageCalculatedPipe,
    AgeGroupsComponent,
    GetControlPipe,
    SettingsComponent,
    CateringSchemeSelectorComponent,
    PersonPricesComponent,
    FilterPricesPipe,
    GetFocusOnEnterMapPipe,
    GetPersonFormControlPipe,
    GetPricingSchemeTypePipe,
    IsPersonHighlightedPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SharedModule,
    MainSharedModule,
    PeriodConfigModule,
    NgbTooltipModule,
    AutoSizeInputModule,
    TableModule
  ],
  exports: [
    PricesComponent
  ],
})
export class PricingSettingsModule { }
