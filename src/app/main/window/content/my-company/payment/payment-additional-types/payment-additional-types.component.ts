import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { MainService } from '@/app/main/main.service';
import { LocalInfoModel } from '@/app/main/window/content/web-tools/booking-tools/model';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { AddPaymentTypeComponent } from '../add-payment-type/add-payment-type.component';
import { LoaderType } from '../loader-types';
import { CustomPaymentTypeModel } from '../models';

@Component({
  selector: 'app-payment-additional-types',
  templateUrl: './payment-additional-types.component.pug',
  styleUrls: ['./payment-additional-types.component.sass']
})
export class PaymentAdditionalTypesComponent implements OnInit {

  public customPayTypes: CustomPaymentTypeModel[];
  public selectedType: CustomPaymentTypeModel ;
  public isLoading: Observable<boolean>;
  public localeInfoList: LocalInfoModel[];
  public isActive: boolean;
  public isCashPayment: boolean;
  public paymentTypeName: string;
  public defaultLocaleID: string;
  public selectedLocale: string;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    public loaderService: LoaderService,
    private modalService: ModalService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.customPayTypes = [];
    this.localeInfoList = [];
    this.isActive = false;
    this.isCashPayment = false;
    this.paymentTypeName = '';
    this.defaultLocaleID = this.mainService.getCompanyDetails().c_beLocale_id.toString();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiPayment.getCustomPaymentType().toPromise(),
      this.apiPayment.getLocaleInfoList().toPromise()
    ]);
    this.customPayTypes = val1;
    this.customPayTypes.map( item => {
      item.id = Number(item.bvpt_id);
      item.display_name = item.locales.find( l => l.bvptl_locale_id === this.defaultLocaleID ) ?
        item.locales.filter(l => l.bvptl_locale_id === this.defaultLocaleID)[0].bvptl_name : item.bvpt_name;
    });
    this.selectedType = this.customPayTypes[0];
    this.localeInfoList = val2;
    this.selectedLocale = this.defaultLocaleID;
    this.initVals();
  }

  public initVals(): void {
    this.isActive = this.selectedType.bvpt_active === 'on';
    this.isCashPayment = this.selectedType.bvpt_isCashPayment === 'on';
    if (this.selectedType.locales.find( item => item.bvptl_locale_id === this.selectedLocale)) {
      this.paymentTypeName = this.selectedType.locales.filter( item => item.bvptl_locale_id === this.selectedLocale)[0].bvptl_name;
    }
  }

  public getListItemNameSuffix(item: CustomPaymentTypeModel): boolean {
    return item.bvpt_active === 'on';
  }

  public selectItem(item: CustomPaymentTypeModel): void {
    this.selectedType = item;
    this.initVals();
  }

  public setIsActive(): void {
    this.customPayTypes.filter(item => item.bvpt_id === this.selectedType.bvpt_id)[0].bvpt_active = this.isActive ? 'on' : 'off';
  }

  public setIsCashPayment(): void {
    // tslint:disable-next-line:max-line-length
    this.customPayTypes.filter(item => item.bvpt_id === this.selectedType.bvpt_id)[0].bvpt_isCashPayment = this.isCashPayment ? 'on' : 'off';
  }

  public setPaymentTypeName(): void {
    // tslint:disable-next-line:max-line-length
    this.customPayTypes.filter(item => item.bvpt_id === this.selectedType.bvpt_id)[0].locales.filter(l => l.bvptl_locale_id === this.selectedLocale)[0].bvptl_name = this.paymentTypeName;
  }

  public setSelectedLocale(): void {
    this.initVals();
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    await Promise.all(
      this.customPayTypes.map( async item => {
        const {id, display_name, ...others} = item;
        await this.apiPayment.putOriginRequest('apiPayment/customPaymentType', id.toString(), others).toPromise();
      })
    );
    this.init();
  }

  public async addType(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.customPaymentTypeNewHeadline.text', AddPaymentTypeComponent, {
      primaryButtonLabel: 'ebc.buttons.add.text',
    });
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result);
      this.init();
    });
  }

  public async delType(): Promise<void> {
    const confirmed = await this.modalService.openConfirm(
      'BackEnd_WikiLanguage.POA_PortalConfirmDeleteMessageHeader',
      'ebc.payment.deleteCustomPaymentType.text',
      {
        primaryButtonLabel: 'ebc.buttons.delete.text',
        secondaryButtonLabel: 'ebc.buttons.cancel.text',
      }
    );
    if (confirmed) {
      await this.apiPayment.deletePaymentType(this.selectedType.bvpt_id).toPromise();
      this.init();
    }
  }

  ngOnInit(): void {
    this.init();
  }

}
