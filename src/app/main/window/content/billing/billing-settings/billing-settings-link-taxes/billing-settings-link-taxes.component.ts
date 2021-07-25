import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import dayjs from 'dayjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { TaxListModel } from '@/app/main/models';
import { UpdateCateringListInLinkTaxesEvent } from '@/app/main/window/content/billing/billing-settings/billing-settings-link-taxes/events';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';
import { CateringModel, TaxationV2Model, TaxPeriodModel } from '../model';
import { TaxChangeHintModalComponent } from '../tax-change-hint-modal/tax-change-hint-modal.component';
import { TaxPeriodsModalComponent } from '../tax-periods-modal/tax-periods-modal.component';

@Component({
  selector: 'app-billing-settings-link-taxes',
  templateUrl: './billing-settings-link-taxes.component.pug',
  styleUrls: ['./billing-settings-link-taxes.component.sass']
})
export class BillingSettingsLinkTaxesComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isLoading: Observable<boolean>;
  taxPeriodsList: TaxPeriodModel[];
  taxList: TaxListModel[];
  taxCatering: CateringModel[];
  taxationV2: TaxationV2Model;
  selectedPeriodId: string;
  selectedRoomPriceId: string;
  selectedCateringId: string;
  selectedVisitorTaxId: string;
  selectedPetChargeId: string;
  selectedCleanupChargeId: string;
  selectedDiscountId: string;
  selectedShortStayChargeId: string;
  selectedCotChargeId: string;
  selectedGarageChargeId: string;
  selectedChargingSchemeChargeId: string;
  selectedWishRoomId: string;
  selectedFoodId: string;
  selectedBeverageId: string;
  isCombineCatering: boolean;
  selectedTaxCateringId: string;
  selectedTaxFoodId: number;
  selectedTaxBeverageId: number;
  percentageList: number[];
  isTaxTableDisabled: boolean;
  showDisabledTooltip: boolean;
  isTaxChanged: boolean;
  copyStr: string;
  private prevRoomPriceId: string;
  private prevCateringId: string;
  private prevVisitorTaxId: string;
  private prevPetChargeId: string;
  private prevCleanupChargeId: string;
  private prevDiscountId: string;
  private prevShortStayChargeId: string;
  private prevCotChargeId: string;
  private prevGarageChargeId: string;
  private prevChargingSchemeChargeId: string;
  private prevWishRoomId: string;
  private prevFoodId: string;
  private prevBeverageId: string;

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private modalService: ModalService,
    private translateService: TranslateService,
    private eventBus: EventBusService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.taxPeriodsList = [];
    this.isCombineCatering = false;
    this.percentageList = [];
    this.isTaxTableDisabled = false;
    this.showDisabledTooltip = false;
    this.isTaxChanged = false;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {

    this.copyStr = await this.translateService.get('BackEnd_WikiLanguage.RCPT_isCopyLabel').toPromise();

    for (let i = 0; i < 101; i++) {
      this.percentageList.push(i);
    }

    const [val1, val2, val3, val4] = await Promise.all([
      this.apiBilling.getTaxListModel().toPromise(),
      this.apiBilling.getTaxPeriodListModel().toPromise(),
      this.apiBilling.getCateringListModel().toPromise(),
      this.apiBilling.getTaxationV2Model().toPromise()
    ]);

    this.taxList = val1;
    this.taxPeriodsList = val2;
    this.taxCatering = val3.filter( item => item.st_id !== '5' && item.st_active === 'on' );
    this.eventBus.on<UpdateCateringListInLinkTaxesEvent>('updateCateringList').pipe(untilDestroyed(this)).subscribe(async () => {
      const [cateringListUpdated] = await Promise.all([
        this.apiBilling.getCateringListModel().toPromise(),
      ]);
      this.taxCatering = cateringListUpdated.filter( item => item.st_id !== '5' && item.st_active === 'on' );
    });
    this.taxationV2 = val4;
    const currentPeriod = this.taxPeriodsList.find( item => item.isCurrentPeriod );
    this.selectedPeriodId = currentPeriod ? currentPeriod.tp_id : '1';
    this.initSplitRateId();
    this.initValues();
  }

  public initSplitRateId(): void {
    const firstSplitRate = this.taxationV2.splitFoodAndBeverage.find(item => item.sttp_taxationPeriod_id === this.selectedPeriodId);
    this.selectedTaxCateringId = firstSplitRate ? firstSplitRate.localisedName : 'OverNight Only';
  }

  public initValues(): void {
    const selectedTaxPeriod = this.taxPeriodsList.find(item => item.tp_id === this.selectedPeriodId) as TaxPeriodModel;
    this.isTaxTableDisabled = (!selectedTaxPeriod.isCurrentPeriod && !this.compareWithToday(selectedTaxPeriod))
      || !selectedTaxPeriod.tp_from;
    this.isCombineCatering = this.taxPeriodsList.filter( item => item.tp_id === this.selectedPeriodId)[0].tp_splitFoodAndBeverage === '1';
    const taxPeriodListSorted = this.taxPeriodsList.sort((a, b) => (+a.tp_id > +b.tp_id) ? 1 : ((+b.tp_id > +a.tp_id) ? -1 : 0));
    const prevLinkTaxesPeriodId = taxPeriodListSorted[this.taxPeriodsList.length - 2].tp_id;
    const lastTaxPeriodId = taxPeriodListSorted[this.taxPeriodsList.length - 1].tp_id;
    this.taxationV2.taxationTable.map( item => {
      if (item.t_taxationPeriod_id === prevLinkTaxesPeriodId) {
        switch (item.t_name) {
          case 'Entity':
            this.prevRoomPriceId = item.t_tax_id;
            break;
          case 'Catering':
            this.prevCateringId = item.t_tax_id;
            break;
          case 'VisitorsTax':
            this.prevVisitorTaxId = item.t_tax_id;
            break;
          case 'PetCharge':
            this.prevPetChargeId = item.t_tax_id;
            break;
          case 'CleanupCharge':
            this.prevCleanupChargeId = item.t_tax_id;
            break;
          case 'Discount':
            this.prevDiscountId = item.t_tax_id;
            break;
          case 'ShortStayCharge':
            this.prevShortStayChargeId = item.t_tax_id;
            break;
          case 'CotCharge':
            this.prevCotChargeId = item.t_tax_id;
            break;
          case 'GarageCharge':
            this.prevGarageChargeId = item.t_tax_id;
            break;
          case 'ChargingSchemeCharge':
            this.prevChargingSchemeChargeId = item.t_tax_id;
            break;
          case 'WishRoom':
            this.prevWishRoomId = item.t_tax_id;
            break;
          case 'Food':
            this.prevFoodId = item.t_tax_id;
            break;
          case 'Beverage':
            this.prevBeverageId = item.t_tax_id;
            break;
          default:
            break;
        }
      }
      if (item.t_taxationPeriod_id === this.selectedPeriodId) {
        if (lastTaxPeriodId === this.selectedPeriodId) {
          switch (item.t_name) {
            case 'Entity':
              this.selectedRoomPriceId = this.prevRoomPriceId;
              break;
            case 'Catering':
              this.selectedCateringId = this.prevCateringId;
              break;
            case 'VisitorsTax':
              this.selectedVisitorTaxId = this.prevVisitorTaxId;
              break;
            case 'PetCharge':
              this.selectedPetChargeId = this.prevPetChargeId;
              break;
            case 'CleanupCharge':
              this.selectedCleanupChargeId = this.prevCleanupChargeId;
              break;
            case 'Discount':
              this.selectedDiscountId = this.prevDiscountId;
              break;
            case 'ShortStayCharge':
              this.selectedShortStayChargeId = this.prevShortStayChargeId;
              break;
            case 'CotCharge':
              this.selectedCotChargeId = this.prevCotChargeId;
              break;
            case 'GarageCharge':
              this.selectedGarageChargeId = this.prevGarageChargeId;
              break;
            case 'ChargingSchemeCharge':
              this.selectedChargingSchemeChargeId = this.prevChargingSchemeChargeId;
              break;
            case 'WishRoom':
              this.selectedWishRoomId = this.prevWishRoomId;
              break;
            case 'Food':
              this.selectedFoodId = this.prevFoodId;
              break;
            case 'Beverage':
              this.selectedBeverageId = this.prevBeverageId;
              break;
            default:
              break;
          }
        } else {
          switch (item.t_name) {
            case 'Entity':
              this.selectedRoomPriceId = item.t_tax_id;
              break;
            case 'Catering':
              this.selectedCateringId = item.t_tax_id;
              break;
            case 'VisitorsTax':
              this.selectedVisitorTaxId = item.t_tax_id;
              break;
            case 'PetCharge':
              this.selectedPetChargeId = item.t_tax_id;
              break;
            case 'CleanupCharge':
              this.selectedCleanupChargeId = item.t_tax_id;
              break;
            case 'Discount':
              this.selectedDiscountId = item.t_tax_id;
              break;
            case 'ShortStayCharge':
              this.selectedShortStayChargeId = item.t_tax_id;
              break;
            case 'CotCharge':
              this.selectedCotChargeId = item.t_tax_id;
              break;
            case 'GarageCharge':
              this.selectedGarageChargeId = item.t_tax_id;
              break;
            case 'ChargingSchemeCharge':
              this.selectedChargingSchemeChargeId = item.t_tax_id;
              break;
            case 'WishRoom':
              this.selectedWishRoomId = item.t_tax_id;
              break;
            case 'Food':
              this.selectedFoodId = item.t_tax_id;
              break;
            case 'Beverage':
              this.selectedBeverageId = item.t_tax_id;
              break;
            default:
              break;
          }
        }
      }
    });

    const res = this.taxationV2.splitFoodAndBeverage.find(
      item => item.sttp_taxationPeriod_id === this.selectedPeriodId && item.localisedName === this.selectedTaxCateringId);
    this.selectedTaxFoodId = Number(res ? res.sttp_foodBeverageSplit.split(':')[0] : 0);
    this.selectedTaxBeverageId = Number(res ? res.sttp_foodBeverageSplit.split(':')[1] : 0);

    // disalbe save
    const currentPeriodIndex = this.taxPeriodsList.indexOf(selectedTaxPeriod);
    const prevPeriod = this.taxPeriodsList[currentPeriodIndex - 1];
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    if (typeof prevPeriod !== 'undefined') {
      const prevPeriodAutoSaved = prevPeriod.tp_autoSaved;
      const lastUpdate = prevPeriod.tp_created;
      const disableUntil = dayjs(lastUpdate).add(24, 'h').format('YYYY-MM-DD HH:mm:ss');
      let prevPeriodUntilPlus2Days;
      if (prevPeriod.tp_until) {
        prevPeriodUntilPlus2Days = dayjs(prevPeriod.tp_until).add(3, 'd').format('YYYY-MM-DD');
      }

      if (now < disableUntil && disableUntil < prevPeriodUntilPlus2Days && prevPeriodAutoSaved === '1') {
        this.showDisabledTooltip = true;
      }
    }
  }

  public getDisableToolTip(): string {
    return this.showDisabledTooltip ? 'ebc.invoiceSettings.blockedHint.text' : '';
  }

  public changeTaxIdOfTaxTable(type: string, value: string): void {
    this.taxationV2.taxationTable.map(
      item => {
        if (item.t_taxationPeriod_id === this.selectedPeriodId && item.t_name === type) {
          item.t_tax_id = value;
        }
      }
    );
    this.isTaxChanged = true;
  }

  public compareWithToday(item: TaxPeriodModel): boolean {
    const today = new Date();
    return dayjs(today).diff(dayjs(item.tp_from)) < 0;
  }

  public changeSplitCheckbox(flag: boolean): void {
    this.isCombineCatering = flag;
    if (this.taxPeriodsList.find(item => item.tp_id === this.selectedPeriodId)) {
      this.taxPeriodsList.filter
      (item => item.tp_id === this.selectedPeriodId)[0].tp_splitFoodAndBeverage = this.isCombineCatering ? '1' : '0';
      this.isTaxChanged = true;
    }
  }

  public changeTaxCateringId(): void {
    this.initValues();
  }

  public changeSplitCateringRate(type: string): void {
    if (type === 'food') {
      this.selectedTaxBeverageId = 100 - this.selectedTaxFoodId;
    } else {
      this.selectedTaxFoodId = 100 - this.selectedTaxBeverageId;
    }
    if (this.taxationV2.splitFoodAndBeverage.find( item =>
      item.sttp_taxationPeriod_id === this.selectedPeriodId && item.localisedName === this.selectedTaxCateringId)) {
      this.taxationV2.splitFoodAndBeverage.filter(
        item => item.sttp_taxationPeriod_id === this.selectedPeriodId && item.localisedName === this.selectedTaxCateringId)[0]
        .sttp_foodBeverageSplit = this.selectedTaxFoodId.toString() + ':' + this.selectedTaxBeverageId.toString();
    } else {
      let stID = '';
      switch (this.selectedTaxCateringId) {
        case 'OverNight Only':
          stID = '1';
          break;
        case 'B&B':
          stID = '2';
          break;
        case 'Halfboard':
          stID = '3';
          break;
        case 'FullBoard':
          stID = '4';
          break;
        default:
          stID = '5';
          break;
      }
      this.taxationV2.splitFoodAndBeverage.push({
        localisedName: this.selectedTaxCateringId,
        st_id: stID,
        sttp_foodBeverageSplit: this.selectedTaxFoodId.toString() + ':' + this.selectedTaxBeverageId.toString(),
        sttp_taxationPeriod_id: this.selectedPeriodId
      });
    }
    this.isTaxChanged = true;
    this.initValues();
  }

  public changeTaxPeriodId(): void {
    this.initSplitRateId();
    this.initValues();
  }

  public async goToSettings(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('ebc.invoiceSettings.taxPeriods.text', TaxPeriodsModalComponent, {
      classes: ['link-taxes-modal'],
      primaryButtonLabel: 'ebc.buttons.save.text',
    });
    modalBody.init();
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result);
      await this.init();
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const selectedTaxPeriod = this.taxPeriodsList.find(item => item.tp_id === this.selectedPeriodId) as TaxPeriodModel;
    selectedTaxPeriod.tp_splitFoodAndBeverage = this.isCombineCatering ? '1' : '0';

    if (this.isTaxChanged && selectedTaxPeriod.isCurrentPeriod) {
      const {modal, modalBody} = this.modalService.openForms('', TaxChangeHintModalComponent, {
        primaryButtonLabel: 'ebc.buttons.continue.text',
        hideHeader: true,
        classes: ['change-room-price-modal']
      });
      modal.save.subscribe( async () => {
        const result: string = modalBody.save();
        if ( result === 'success') {
          modal.close(!!result);
          await this.saveWithCaution(selectedTaxPeriod);
          await this.init();
        } else {
          return;
        }
      });
    } else {
      await Promise.all([
        this.apiBilling.putTaxationV2Request(this.taxationV2, false).toPromise(),
        this.apiBilling.putBillingRequest('apiHotel/taxationPeriod', {
          taxationPeriodTable: [
            selectedTaxPeriod
          ]
        }).toPromise()
      ]);
    }
  }

  @Loading(LoaderType.LOAD)
  public async saveWithCaution(selectedTaxPeriod: TaxPeriodModel): Promise<void> {
    selectedTaxPeriod.tp_autoSaved = '1';
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'd').format('YYYY-MM-DD');
    const newPeriodObj = {
      tp_from: today,
      tp_until: selectedTaxPeriod.tp_until,
      tp_description: 'Kopie ' + selectedTaxPeriod.tp_description,
      tp_splitFoodAndBeverage: selectedTaxPeriod.tp_splitFoodAndBeverage
    };
    await Promise.all([
      this.apiBilling.putBillingRequest('apiHotel/taxationPeriod', {
        taxationPeriodTable: [
          selectedTaxPeriod
        ]
      }).toPromise(),
      this.apiBilling.postBillingBodyRequest('apiHotel/taxationPeriod', newPeriodObj, true).toPromise().then(
        async () => {
          selectedTaxPeriod.tp_until = yesterday;
          await this.apiBilling.putBillingRequest('apiHotel/taxationPeriod', {
            taxationPeriodTable: [
              selectedTaxPeriod
            ]
          }).toPromise().then(
            async () => {
              await this.apiBilling.putTaxationV2Request(this.taxationV2, true).toPromise();
            }
          );
        }
      ),

    ]);
  }

  async ngOnInit(): Promise<void> {
    await this.init();
  }

  ngOnDestroy() {
  }

}
