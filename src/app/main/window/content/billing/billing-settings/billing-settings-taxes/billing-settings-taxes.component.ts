import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { TaxListModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { AddBillingTaxComponent } from '../add-billing-tax/add-billing-tax.component';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-billing-settings-taxes',
  templateUrl: './billing-settings-taxes.component.pug',
  styleUrls: ['./billing-settings-taxes.component.sass']
})
export class BillingSettingsTaxesComponent implements OnInit {

  public taxList: TaxListModel[];
  public selectedType: TaxListModel;
  public isLoading: Observable<boolean>;
  public isNonStandard: boolean;
  public taxName: number;

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    public loaderService: LoaderService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.taxList = [];
    this.isNonStandard = false;
    this.taxName = 0;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.taxList = await this.apiBilling.getTaxListModel().toPromise();
    this.taxList.map( item => {
      item.id = Number(item.t_id);
    });
    this.selectedType = this.taxList[0];
    this.initVals();
  }

  public initVals(): void {
    this.isNonStandard = this.selectedType.t_isNonStandardTax === 'on';
    this.taxName = this.selectedType.t_decimal;
  }

  public selectItem(item: TaxListModel): void {
    this.selectedType = item;
    this.initVals();
  }

  public setIsNonStandard(): void {
    this.taxList.filter(item => item.t_id === this.selectedType.t_id)[0].t_isNonStandardTax = this.isNonStandard ? 'on' : 'off';
  }

  public setTaxName(): void {
    this.taxList.filter(item => item.t_id === this.selectedType.t_id)[0].t_decimal = this.taxName;
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    await Promise.all(
      this.taxList.map( async item => {
        const body = {
          t_decimal: item.t_decimal,
          t_id: item.t_id.toString(),
          t_isNonStandardTax: item.t_isNonStandardTax,
          t_name: item.t_decimal.toString() + '%'
        };
        await this.apiBilling.putBillingRequestWithId('apiHotel/tax', item.t_id.toString(), body).toPromise();
      })
    );
    this.init();
  }

  public async addTax(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('', AddBillingTaxComponent, {
      primaryButtonLabel: 'ebc.buttons.add.text',
      hideHeader: true
    });
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result);
      this.init();
    });
  }

  @Loading(LoaderType.LOAD)
  public async delTax(): Promise<void> {
    await this.apiBilling.deleteBillingRequest('apiHotel/tax', this.selectedType.t_id.toString(), true).toPromise();
    this.init();
  }

  ngOnInit(): void {
    this.init();
  }

}
