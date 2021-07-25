import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { LanguageService } from '@/app/i18n/language.service';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { BillingGeneralModel } from '../model';

@Component({
  selector: 'app-billing-settings-invoice-item',
  templateUrl: './billing-settings-invoice-item.component.pug',
  styleUrls: ['./billing-settings-invoice-item.component.sass']
})
export class BillingSettingsInvoiceItemComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public billingInfo: BillingGeneralModel;


  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    private languageService: LanguageService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {

    this.billingInfo = await this.apiBilling.getBillingInfoModel().toPromise();

    this.form = new FormGroup({
      b_visitorsTax: new FormControl(this.billingInfo.b_visitorsTax === 'on' ),
      b_cleanupCharge: new FormControl(this.billingInfo.b_cleanupCharge === 'on' ),
      b_petCharge: new FormControl(this.billingInfo.b_petCharge === 'on' ),
      b_cotCharge: new FormControl(this.billingInfo.b_cotCharge === 'on' ),
      b_catering: new FormControl(this.billingInfo.b_catering === 'on' ),
      b_garage: new FormControl(this.billingInfo.b_garage === 'on' ),
      b_earlyBirdDiscount: new FormControl(this.billingInfo.b_earlyBirdDiscount === 'on' ),
      b_longStayDiscount: new FormControl(this.billingInfo.b_longStayDiscount === 'on' ),
      b_otherCharges: new FormControl(this.billingInfo.b_otherCharges === 'on' ),
      b_shortStayCharge: new FormControl(this.billingInfo.b_shortStayCharge === 'on' ),
      b_lastMinuteDiscount: new FormControl(this.billingInfo.b_lastMinuteDiscount === 'on' ),
      b_wishroomCharge: new FormControl(this.billingInfo.b_wishroomCharge === 'on' ),
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      b_visitorsTax: formVals.b_visitorsTax ? 'on' : 'off',
      b_cleanupCharge: formVals.b_cleanupCharge ? 'on' : 'off',
      b_petCharge: formVals.b_petCharge ? 'on' : 'off',
      b_cotCharge: formVals.b_cotCharge ? 'on' : 'off',
      b_catering: formVals.b_catering ? 'on' : 'off',
      b_garage: formVals.b_garage ? 'on' : 'off',
      b_earlyBirdDiscount: formVals.b_earlyBirdDiscount ? 'on' : 'off',
      b_longStayDiscount: formVals.b_longStayDiscount ? 'on' : 'off',
      b_otherCharges: formVals.b_otherCharges ? 'on' : 'off',
      b_shortStayCharge: formVals.b_shortStayCharge ? 'on' : 'off',
      b_lastMinuteDiscount: formVals.b_lastMinuteDiscount ? 'on' : 'off',
      b_wishroomCharge: formVals.b_wishroomCharge ? 'on' : 'off',
    };

    await this.apiBilling.putBillingRequest('apiHotel/billing', body).toPromise();
  }

  public openReference(): void {
    redirectWithPOST(
      getUrl('/wo/Services/com/gotoacademy.php'),
      {
        screen: 'settingsSurchargesExtra',
        l_id: String(this.languageService.getLanguageId())
      }
    );
  }

  ngOnInit(): void {
    this.init();
  }

}
