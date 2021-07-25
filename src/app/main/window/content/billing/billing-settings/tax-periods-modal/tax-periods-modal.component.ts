import { Component, OnInit } from '@angular/core';

import dayjs from 'dayjs';
import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { stringifyDate } from '@/app/helpers/date';
import { MainService } from '@/app/main/main.service';
import { TaxListModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { LoaderType } from '../loader-types';
import { TaxationV2Model, TaxPeriodModel } from '../model';

@Component({
  selector: 'app-tax-periods-modal',
  templateUrl: './tax-periods-modal.component.pug',
  styleUrls: ['./tax-periods-modal.component.sass']
})
export class TaxPeriodsModalComponent implements OnInit {

  isLoading: Observable<boolean>;
  taxPeriodsList: TaxPeriodModel[];
  taxes: TaxationV2Model;
  taxRates: TaxListModel[];
  autoSavedTooltip: string[] = [];
  defaultLocale: string;
  public minStartDate: Date;
  public toDeleteList: string[] = [];

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private loaderService: LoaderService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TAX_PERIOD_MODAL);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.taxPeriodsList = [];
  }

  @Loading(LoaderType.TAX_PERIOD_MODAL)
  public async init(): Promise<void> {
    const [val1, val2, val3] = await Promise.all([
      this.apiBilling.getTaxPeriodListModel().toPromise(),
      this.apiBilling.getTaxationV2Model().toPromise(),
      this.apiBilling.getTaxListModel().toPromise(),
    ]);
    this.taxPeriodsList = val1;
    this.taxes = val2;
    this.taxRates = val3;
    this.createAutoSaveTooltipContent();
  }

  public createAutoSaveTooltipContent(): void {
    let taxLabel = '';
    let taxOld = '';
    let taxNew = '';
    const autoSavedPeriods = this.taxPeriodsList.filter(item => item.tp_autoSaved === '1');
    let splitChanged = false;

    const taxationTable = this.taxes.taxationTable;
    const splitFoodAndBeverage = this.taxes.splitFoodAndBeverage;

    if (autoSavedPeriods.length > 0) {
      autoSavedPeriods.map( item => {
        splitChanged = false;
        let periodTooltip = '';
        const currentPeriodIndex = this.taxPeriodsList.indexOf(item);
        const nextPeriod = this.taxPeriodsList[currentPeriodIndex + 1];
        const currentTaxes = taxationTable.filter(t => t.t_taxationPeriod_id === item.tp_id);
        // var nextPeriodTaxes = that.taxes.where({t_taxationPeriod_id: "2"});
        const nextPeriodTaxes = taxationTable.filter(t => t.t_taxationPeriod_id === nextPeriod.tp_id);

        let cateringTaxId = '';
        let cateringTax = '';
        let foodTaxId = '';
        let foodTax = '';
        let beverageTaxId = '';
        let beverageTax = '';

        if ( item.tp_splitFoodAndBeverage === '1' && nextPeriod.tp_splitFoodAndBeverage === '0') {
          splitChanged = true;
          cateringTaxId = nextPeriodTaxes.filter(t => t.t_name === 'Catering')[0].t_tax_id;
          cateringTax = this.taxRates.filter(t => t.t_id.toString() === cateringTaxId)[0].t_name;
          foodTaxId = currentTaxes.filter(t => t.t_name === 'Food')[0].t_tax_id;
          foodTax = this.taxRates.filter(t => t.t_id.toString() === foodTaxId)[0].t_name;
          beverageTaxId = currentTaxes.filter(t => t.t_name === 'Beverage')[0].t_tax_id;
          beverageTax = this.taxRates.filter(t => t.t_id.toString() === beverageTaxId)[0].t_name;
          periodTooltip += `
          <ul>
            <li>${this.defaultLocale === '1' ? 'Split of catering deactivated' : 'Aufteilung Verpflegung deaktiviert'}</li>\n
            <li>${this.defaultLocale === '1' ? 'Catering ' : 'Verpflegung '}</li>
            ${this.defaultLocale === '1' ? 'new tax rate: ' : 'neuer Steuersatz: '}${cateringTax}\n
            <li>${this.defaultLocale === '1' ? 'Catering ' : 'Verpflegung '}</li>
            ${this.defaultLocale === '1' ? 'old tax rate: ' : 'alter Steuersatz: '}
            ${this.defaultLocale === '1' ? 'Food ' : 'Speisen '}${foodTax}
            ${this.defaultLocale === '1' ? ' | Beverages' : ' | Getränke'}${beverageTax}</li>
          </ul>
          `;

        }

        if (item.tp_splitFoodAndBeverage === '0' && nextPeriod.tp_splitFoodAndBeverage === '1') {
          splitChanged = true;
          cateringTaxId = currentTaxes.filter(t => t.t_name === 'Catering')[0].t_tax_id;
          cateringTax = this.taxRates.filter(t => t.t_id.toString() === cateringTaxId)[0].t_name;
          foodTaxId = nextPeriodTaxes.filter(t => t.t_name === 'Food')[0].t_tax_id;
          foodTax = this.taxRates.filter(t => t.t_id.toString() === foodTaxId)[0].t_name;
          beverageTaxId = nextPeriodTaxes.filter(t => t.t_name === 'Beverage')[0].t_tax_id;
          beverageTax = this.taxRates.filter(t => t.t_id.toString() === beverageTaxId)[0].t_name;

          periodTooltip += `
          <ul>
            <li>${this.defaultLocale === '1' ? 'Split of catering activated' : 'Aufteilung Verpflegung aktiviert'}</li>\n
            <li>${this.defaultLocale === '1' ? 'Catering ' : 'Verpflegung '}</li>
            ${this.defaultLocale === '1' ? 'new tax rate: ' : 'neuer Steuersatz: '}
            ${this.defaultLocale === '1' ? 'Food ' : 'Speisen '}${foodTax}
            ${this.defaultLocale === '1' ? ' | Beverages' : ' | Getränke '}${beverageTax}\n
            <li>${this.defaultLocale === '1' ? 'Catering ' : 'Verpflegung '}</li>
            ${this.defaultLocale === '1' ? 'old tax rate: ' : 'alter Steuersatz: '}${cateringTax}
          </ul>
          `;

        }

        const taxesToSkip = ['Catering', 'Food', 'Beverage'];
        currentTaxes.map(tax => {
          if (taxesToSkip.indexOf(tax.t_name) > -1 && splitChanged) {
            return true;
          }

          const taxToCompare = nextPeriodTaxes.filter(t => t.t_name === tax.t_name)[0];

          if (tax.t_tax_id !== taxToCompare.t_tax_id) {// tax has changed
            taxLabel = this.getLabelForTooltip(tax.t_name);
            taxOld = this.taxRates.filter(t => t.t_id.toString() === tax.t_tax_id)[0].t_name;
            taxNew = this.taxRates.filter(t => t.t_id.toString() === taxToCompare.t_tax_id)[0].t_name;
            periodTooltip += `
            <ul>
              <li>${taxLabel}${this.defaultLocale === '1' ? ' new tax rate: ' : ' neuer Steuersatz: '}${taxNew}\n
              <li>${taxLabel}${this.defaultLocale === '1' ? ' old tax rate: ' : ' alter Steuersatz: '}${taxOld}\n
             </ul>
            `;
          }
        });

        // check changes for foodAndBeverageSplit
        const splitTaxes = splitFoodAndBeverage.filter(t => t.sttp_taxationPeriod_id === item.tp_id);
        const nextSplitTaxes = splitFoodAndBeverage.filter(t => t.sttp_taxationPeriod_id === nextPeriod.tp_id);

        splitTaxes.map(tax => {
          const res = nextSplitTaxes.filter(t => t.st_id === tax.st_id)[0]; // where({t_name: tax.get('t_name')});
          if (tax.sttp_foodBeverageSplit !== res.sttp_foodBeverageSplit) {  // tax has changed
            taxLabel = tax.localisedName;
            const oldSplit = tax.sttp_foodBeverageSplit.split(':');
            const newSplit = res.sttp_foodBeverageSplit.split(':');

            periodTooltip += `
            <ul>
              <li>${this.defaultLocale === '1' ? 'Split of catering changed (' : 'Änderung Verpflegungsaufteilung ('}${taxLabel})</li>\n
              <li>${this.defaultLocale === '1' ? 'old: ' : 'alt: '}${this.defaultLocale === '1' ? 'Food ' : 'Speisen '}${oldSplit[0]}
              ${this.defaultLocale === '1' ? '% | Beverages ' : '% | Getränke '}${oldSplit[1]}%</li>\n
              <li>${this.defaultLocale === '1' ? 'new' : 'neu'}: ${this.defaultLocale === '1' ? 'Food' : 'Speisen'} ${newSplit[0]}
              ${this.defaultLocale === '1' ? '% | Beverages ' : '% | Getränke '}${newSplit[1]}%</li>
             </ul>
            `;
          }
        });
        if (periodTooltip.length > 0) {
          this.autoSavedTooltip[item.tp_id] = `
            ${this.defaultLocale === '1' ?
              'Automatic saving of the period was triggered by the following change:'
            : 'Automatische Speicherung der Periode wurde durch folgende Änderung ausgelöst:'}\n
            ${periodTooltip}
          `;
        }
      });
    }
  }

  public getLabelForTooltip(taxName: string): string {
    let key = taxName.charAt(0).toLowerCase() + taxName.slice(1);

    if (taxName === 'ChargingSchemeCharge') {
      key = 'otherCharges';
    }

    const label = 'ebc.invoiceSettings.' + key + '.text';

    if (label.indexOf('.text') > -1) {
      return '';
    }

    return label;
  }

  public addPeriod(): void {
    const lastTpId = this.taxPeriodsList[this.taxPeriodsList.length - 1].tp_id;
    let lastestDate = this.taxPeriodsList.map( e => {
      if (e.tp_until) {
        return e.tp_until;
      }}).sort().reverse()[0];
    this.taxPeriodsList.map ( item => {
      if (dayjs(item.tp_from).diff(dayjs(lastestDate)) > 0) {
        lastestDate = item.tp_from;
      }
      if ( item.tp_id === lastTpId && !item.tp_until && lastestDate) {
        item.tp_until = lastestDate;
      }});

    this.minStartDate = new Date();
    const formattedMinStartDate = dayjs(this.minStartDate).format('YYYY-MM-DD');
    if (this.taxPeriodsList.filter(period => dayjs(new Date(period.tp_from)).format('YYYY-MM-DD') === formattedMinStartDate).length === 1) {
      this.minStartDate.setDate(new Date(this.minStartDate).getDate() + 1);
    }

    if (this.taxPeriodsList.filter(period => (period.tp_until === null && period.tp_created))) {
      this.minStartDate.setDate(new Date(this.minStartDate).getDate() + 1);
    }

    if (lastestDate) {
      this.minStartDate.setDate(new Date(lastestDate).getDate() + 1);
    }

    const obj = {
      tp_description: '',
      tp_from: '',
      tp_until: null,
      tp_id: (Number(lastTpId) + 1).toString(),
      isCurrentPeriod: true,
      tp_autoSaved: '0'
    };

    this.taxPeriodsList.push(obj);
  }

  public deletePeriod(item: TaxPeriodModel, deleteFlag: boolean): void {
    this.taxPeriodsList = this.taxPeriodsList.filter( t => t.tp_id !== item.tp_id);
    this.taxPeriodsList = this.taxPeriodsList.map((period, index) => {
      if (period.isCurrentPeriod === true && index === this.taxPeriodsList.length - 1) {
        return { ...period, tp_until: null };
      }
      return period;
    });
    if ( !deleteFlag ) {
      this.toDeleteList.push(item.tp_id);
    }
  }

  public changeFromDate(event, item: TaxPeriodModel): void {
    this.taxPeriodsList[this.taxPeriodsList.indexOf(item)].tp_from = stringifyDate(new Date(event));
    const currentPeriod = this.taxPeriodsList.filter(period => period.isCurrentPeriod === true);
    const newAddedPeriod = this.taxPeriodsList.filter(period => period.isCurrentPeriod === true && period.tp_until === null);
    const fromDateOfNewAddedPeriod = new Date(`${newAddedPeriod[newAddedPeriod.length - 1].tp_from}`);
    const untilDateOfCurrentPeriod = new Date(fromDateOfNewAddedPeriod.setDate(fromDateOfNewAddedPeriod.getDate() - 1));
    if (newAddedPeriod.length) {
      currentPeriod[currentPeriod.length - 2].tp_until = stringifyDate(untilDateOfCurrentPeriod);
    }
  }

  public changeUntilDate(event, item: TaxPeriodModel): void {
    this.taxPeriodsList[this.taxPeriodsList.indexOf(item)].tp_until = stringifyDate(new Date(event));
    const currentPeriod = this.taxPeriodsList.filter(period => period.isCurrentPeriod === true && period.tp_until !== null);
    const newAddedPeriod = this.taxPeriodsList.filter(period => period.isCurrentPeriod === true && period.tp_until === null);
    const untilDateOfCurrentPeriod = new Date(`${currentPeriod[currentPeriod.length - 1].tp_until}`);
    const fromDateOfNewAddedPeriod = new Date(untilDateOfCurrentPeriod.setDate(untilDateOfCurrentPeriod.getDate() + 1));
    if (newAddedPeriod.length) {
      newAddedPeriod[newAddedPeriod.length - 1].tp_from = stringifyDate(fromDateOfNewAddedPeriod);
    }
  }

  public changeDescription(event, item: TaxPeriodModel): void {
    this.taxPeriodsList[this.taxPeriodsList.indexOf(item)].tp_description = event.target.value;
  }

  public compareWithToday(item: TaxPeriodModel): boolean {
    const today = new Date();
    return dayjs(today).diff(dayjs(item.tp_from)) < 0;
  }
  @Loading(LoaderType.TAX_PERIOD_MODAL)
  public async save(): Promise<any> {
    if ( this.toDeleteList.length > 0) {
      const promises = this.toDeleteList.map( async item => this.apiBilling.deleteTaxPeriodRequest(item).toPromise() );
      await Promise.all(promises);
    }
    const obj = {
      taxationPeriodTable: this.taxPeriodsList
    };
    const res = await this.apiBilling.putTaxPeriodListRequest(obj).toPromise();
    return res;
  }

  ngOnInit() {
  }
}
