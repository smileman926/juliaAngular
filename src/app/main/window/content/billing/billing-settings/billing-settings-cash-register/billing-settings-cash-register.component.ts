import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { BillingGeneralModel } from '../model';

@Component({
  selector: 'app-billing-settings-cash-register',
  templateUrl: './billing-settings-cash-register.component.pug',
  styleUrls: ['./billing-settings-cash-register.component.sass']
})
export class BillingSettingsCashRegisterComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public billingInfo: BillingGeneralModel;
  public selectedReceipt: string;
  public ReceiptTypes: string[] = [
    'Bon', 'A5', 'A4'
  ];

  constructor(
    private apiBilling: ApiBillingWorkbenchService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {

    this.billingInfo = await this.apiBilling.getBillingInfoModel().toPromise();

    this.form = new FormGroup({
      b_receiptFormat: new FormControl(
        this.billingInfo.b_receiptFormat === 'manual'
        ? 'manual' : 'noManual'),
      b_receiptFormatType: new FormControl(
        this.billingInfo.b_receiptFormat === 'manual' ? 'Bon' : this.billingInfo.b_receiptFormat
      ),
      b_receiptAddressType: new FormControl(this.billingInfo.b_receiptAddressType)
    });
    if (this.billingInfo.b_receiptFormat === 'manual') {
      (this.form.get('b_receiptFormatType') as FormControl).disable();
    }
    this.onChanges();
  }

  onChanges(): void {
    (this.form.get('b_receiptFormat') as FormControl).valueChanges.subscribe(val => {
      if (val === 'manual') {
        (this.form.get('b_receiptFormatType') as FormControl).disable();
      } else {
        (this.form.get('b_receiptFormatType') as FormControl).enable();
      }
    });
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      b_receiptFormat: formVals.b_receiptFormat === 'manual' ? 'manual' : formVals.b_receiptFormatType,
      b_receiptAddressType: formVals.b_receiptAddressType
    };
    await this.apiBilling.putBillingRequest('apiHotel/billing', body).toPromise();
  }

  ngOnInit(): void {
    this.init();
  }

}
