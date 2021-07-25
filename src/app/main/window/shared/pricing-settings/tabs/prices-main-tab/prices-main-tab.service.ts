import { preparePricingBody } from '@/app/main/window/shared/pricing-settings/reduce';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import {
  CateringEntity,
  PersonPricingEntity,
  Pricing,
  PricingAgeGroup, PricingPrices,
  PricingSource,
  ServiceType
} from '@/app/main/window/shared/pricing-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';

@Injectable()
export class PricesMainTabService implements OnDestroy {
  public cateringTypes: ServiceType[];
  public cleanUpChargeActive: boolean;
  public hasCateringsScheme: boolean;
  public pricing: Pricing;
  public pricingLangSchemes: FormOption[] = [];
  public pricingSchemes: FormOption[] = [];
  public saved: EventEmitter<void> = new EventEmitter();
  public showAgeGroups: boolean;
  public source: PricingSource;
  public period: SeasonPeriod;
  public cateringOutOfRoomPrice: boolean;
  public otherCateringRelative: boolean;
  public showAgeGroupsForCaterings: boolean;
  public displayCateringId?: number;
  public hasChanges = false;

  private formDirty: FormDirtyStates = {};
  private languageId: number;

  constructor(
    private apiClient: ApiClient,
    private formData: FormDataService,
    private loaderService: LoaderService,
    private mainService: MainService,
    private eventBusService: EventBusService,
  ) {
    this.mainService.company$.pipe(untilDestroyed(this)).subscribe(companyDetails => {
      if (!companyDetails) {
        return;
      }
      this.processCompanyData(companyDetails);
      const languageChanged = +companyDetails.c_beLocale_id !== this.languageId;
      this.loadPricing(undefined, undefined, languageChanged).catch();
      if (languageChanged) {
        this.languageId = +companyDetails.c_beLocale_id;
        this.fetchCateringTypes().catch();
      }
    });
    this.eventBusService.on('reloadActiveServiceTypes').pipe(untilDestroyed(this)).subscribe(() => {
      this.loadPricing().catch();
    });
  }

  public createPersonPricingEntity(personsNo: number, typeId: number, seasonPeriodEntityId: number): PersonPricingEntity {
    const newEntity: PersonPricingEntity = {
      personsNo,
      typeId,
      adultPrice: 0,
      isStdPricePosition: false,
      percDiscount: 0,
      seasonPeriodEntityId,
      ages: this.pricing.ageGroups.map(ageGroup => ({
        id: ageGroup.id,
        from: ageGroup.from,
        to: ageGroup.to,
        price: 0
      }))
    };
    this.pricing.prices[typeId.toString()].push(newEntity);
    sortPricingEntities(this.pricing.prices[typeId.toString()]);
    return newEntity;
  }

  public async loadPricing(source?: PricingSource, period?: SeasonPeriod, forcedPricingSchemeUpdate?: boolean): Promise<void> {
    if (source) {
      this.source = source;
    }
    if (period) {
      this.period = period;
    }
    if (!this.source || !this.period) {
      return;
    }
    await this.fetchPricing(forcedPricingSchemeUpdate);
    this.updateDisplayCateringId();
  }

  @Loading(LoaderType.Pricing)
  public async resetGroups(): Promise<void> {
    await this.apiClient.resetAgeGroup(this.period.id, this.source).toPromise();
    this.saved.emit();
    await this.loadPricing();
  }

  @Loading(LoaderType.Pricing)
  public async savePricing(forAll: boolean): Promise<void> {
    const pricingBody = preparePricingBody(this.pricing);
    await this.apiClient.savePricing(this.period.id, this.source, forAll, pricingBody).toPromise();
    this.updateDisplayCateringId();
    this.saved.emit();
  }

  public setFormDirtyState(form: keyof FormDirtyStates, changed: boolean): void {
    this.formDirty[form] = changed;
    this.hasChanges = Object.values(this.formDirty).some(changeState => changeState);
  }

  public updatePrices(filteredPrices: PricingPrices): void {
    Object.keys(filteredPrices).filter(key => filteredPrices.hasOwnProperty(key)).forEach(key => {
      if (!this.pricing.prices.hasOwnProperty(key)) {
        this.pricing.prices[key] = filteredPrices[key];
        return;
      }
      const existingPricing = this.pricing.prices[key];
      filteredPrices[key].forEach(pricingEntity => {
        const existingIndex = existingPricing.findIndex(entity => entity.personsNo === pricingEntity.personsNo);
        if (existingIndex >= 0) {
          existingPricing[existingIndex] = pricingEntity;
        } else {
          existingPricing.push(pricingEntity);
          sortPricingEntities(existingPricing);
        }
      });
    });
  }

  @Loading(LoaderType.Pricing)
  public async resetApartment() {
    if (!this.source || this.source.type !== 'apartment') {
      return;
    }
    await this.apiClient.resetApartment(this.source.id, this.period.id).toPromise();
    this.fetchPricing().catch();
  }

  @Loading(LoaderType.LoadPricing)
  private async fetchCateringTypes(): Promise<void> {
    this.cateringTypes = await this.apiClient.getActiveServiceType(true).toPromise();
  }

  @Loading(LoaderType.LoadPricing)
  private async fetchPricing(forcedPricingSchemeUpdate?: boolean): Promise<void> {
    if (!this.source || !this.period) {
      return;
    }
    const [pricing, [pricingSchemes, pricingLangSchemes]] = await Promise.all([
      this.apiClient.getPricing(this.source, this.period.id).toPromise(),
      this.formData.getPricingSchemes(forcedPricingSchemeUpdate)
    ]);
    pricing.ageGroups = this.getSortedAgeGroups(pricing.ageGroups);
    this.pricing = pricing;
    this.pricingSchemes = pricingSchemes;
    this.pricingLangSchemes = pricingLangSchemes;
  }

  private processCompanyData(companyDetails: CompanyDetails | null): void {
    if (!companyDetails) {
      this.showAgeGroups = false;
      this.hasCateringsScheme = false;
      this.cleanUpChargeActive = false;
      this.cateringOutOfRoomPrice = false;
      this.otherCateringRelative = false;
      this.showAgeGroupsForCaterings = false;
      return;
    }
    const {c_hasAdvancedPricingModule, c_methodDefaultCatering, c_methodOtherCatering, cleanUpChargeActive} = companyDetails;
    this.showAgeGroups = c_hasAdvancedPricingModule === 'on';
    this.hasCateringsScheme = (c_methodDefaultCatering === 'quota' && c_methodOtherCatering === 'absolute');
    this.cleanUpChargeActive = cleanUpChargeActive;
    this.cateringOutOfRoomPrice = c_methodDefaultCatering === 'quota';
    this.otherCateringRelative = c_methodOtherCatering === 'relative';
    this.showAgeGroupsForCaterings = this.showAgeGroups && !(this.cateringOutOfRoomPrice && !this.otherCateringRelative);
  }

  private updateDisplayCateringId(): void {
    if (!this.hasCateringsScheme) {
      this.displayCateringId = 0;
      return;
    }
    const cateringForDisplay = this.getCateringForDisplay();
    this.displayCateringId = cateringForDisplay ? cateringForDisplay.typeId : undefined;
  }

  private getCateringForDisplay(): CateringEntity | undefined {
    if (!this.pricing || !this.pricing.caterings) {
      return undefined;
    }
    return this.pricing.caterings.find(catering => catering.stdDisplayPrice);
  }

  /** region age groups */
  public addAgeGroup(): void {
    if (!this.pricing || !this.pricing.ageGroups) {
      return;
    }
    const ageGroups = [...this.pricing.ageGroups];
    const newId = Symbol('ageGroup');
    ageGroups.push({
      id: newId,
      from: 0,
      to: 0,
      discount: 0
    });
    this.pricing.ageGroups = this.getSortedAgeGroups(ageGroups);
  }

  public deleteAgeGroup(ageGroup: PricingAgeGroup): void {
    this.pricing.ageGroups.splice(this.pricing.ageGroups.indexOf(ageGroup), 1);
  }

  public ageGroupEdited(): void {
    if (!this.pricing || !this.pricing.ageGroups) {
      return;
    }
    this.pricing.ageGroups = this.getSortedAgeGroups(this.pricing.ageGroups);
  }

  private getSortedAgeGroups(ageGroups: PricingAgeGroup[]): PricingAgeGroup[] {
    if (!ageGroups) {
      ageGroups = [...this.pricing.ageGroups];
    }
    ageGroups.sort((group1, group2) => {
      if (group1.from === group2.from) {
        return group1.to - group2.to;
      }
      return group1.from - group2.from;
    });
    return [...ageGroups];
  }
  /** endregion */

  ngOnDestroy(): void {}
}

function sortPricingEntities(pricingEntities: PersonPricingEntity[]): void {
  pricingEntities.sort((entity1, entity2) => {
    return entity1.personsNo - entity2.personsNo;
  });
}

interface FormDirtyStates {
  ageGroups?: boolean;
  caterings?: boolean;
  pricing?: boolean;
  pricingScheme?: boolean;
  settings?: boolean;
}
