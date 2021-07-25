import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { MainService } from '@/app/main/main.service';
import { BillingService } from '@/app/main/window/content/services/billing/billing.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';

import { LoaderType } from '../loader-types';
import { BillingDefaultTextModel, BillingGeneralModel } from '../model';
import { TextTranslateComponent } from '../text-translate/text-translate.component';

@Component({
  selector: 'app-billing-settings-general',
  templateUrl: './billing-settings-general.component.pug',
  styleUrls: ['./billing-settings-general.component.sass']
})
export class BillingSettingsGeneralComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public defaultText: string;
  public translations: BillingDefaultTextModel[];
  public billingInfo: BillingGeneralModel;
  public defaultLocale: string;

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private modalService: ModalService,
    public loaderService: LoaderService,
    private billingService: BillingService,
    private mainService: MainService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiBilling.getBillingInfoModel().toPromise(),
      this.apiBilling.getBillingDefaultTextModel().toPromise()
    ]);

    this.billingInfo = val1;
    this.translations = val2;
    const defaultID = this.defaultLocale.toString();
    this.defaultText = this.translations.filter( item => item.bdt_locale_id === defaultID)[0].bdt_text;

    this.form = new FormGroup({
      b_billNoFormat: new FormControl(this.billingInfo.b_billNoFormat),
      b_initBillnoAtBeginningOfYear: new FormControl(this.billingInfo.b_initBillnoAtBeginningOfYear === 'on'),
      b_showRoomNo: new FormControl(this.billingInfo.b_showRoomNo === 'on'),
      b_showTaxTable: new FormControl(this.billingInfo.b_showTaxTable === 'on'),
      b_showSplitBillsByDefault: new FormControl(this.billingInfo.b_showSplitBillsByDefault === 'on')
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      b_billNoFormat: formVals.b_billNoFormat,
      b_initBillnoAtBeginningOfYear: formVals.b_initBillnoAtBeginningOfYear ? 'on' : 'off',
      b_showRoomNo: formVals.b_showRoomNo ? 'on' : 'off',
      b_showTaxTable: formVals.b_showTaxTable ? 'on' : 'off',
      b_showSplitBillsByDefault: formVals.b_showSplitBillsByDefault ? 'on' : 'off'
    };

    await this.apiBilling.putBillingRequest('apiHotel/billing', body).toPromise();
    this.billingService.onBillingSettingsGeneralSave();
  }

  @Loading(LoaderType.LOAD)
  public async getDefaultTranslateText(): Promise<string> {
    const res = await this.apiBilling.getBillingDefaultTextModel().toPromise();
    return res.filter(item => item.bdt_locale_id === this.defaultLocale.toString())[0].bdt_text;
  }

  public async changeTranslate() {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', TextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      hideSecondaryButton: true,
      ngbOptions: {
        size: 'lg'
      }
    });
    modalBody.init();
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      modal.close(!!result.res);
      this.defaultText = await this.getDefaultTranslateText();
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
