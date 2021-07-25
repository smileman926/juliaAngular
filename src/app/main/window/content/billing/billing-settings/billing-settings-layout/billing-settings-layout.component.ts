import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { MainService } from '@/app/main/main.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environmentDefaults } from '@/environments/defaults';
import { LoaderType } from '../loader-types';
import { BillingGeneralModel } from '../model';

@Component({
  selector: 'app-billing-settings-layout',
  templateUrl: './billing-settings-layout.component.pug',
  styleUrls: ['./billing-settings-layout.component.sass']
})
export class BillingSettingsLayoutComponent implements OnInit {

  form: FormGroup;
  public isLoading: Observable<boolean>;
  public billingInfo: BillingGeneralModel;
  public headImg: string;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private apiClient: ApiClient,
    private apiBilling: ApiBillingWorkbenchService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {

    this.billingInfo = await this.apiBilling.getBillingInfoModel().toPromise();

    this.form = new FormGroup({
      b_showFooterText: new FormControl(this.billingInfo.b_showFooterText === 'on' ),
      b_showHotelAddress: new FormControl(this.billingInfo.b_showHotelAddress === 'on' ),
      b_freeText1: new FormControl(this.billingInfo.b_freeText1),
      b_freeText2: new FormControl(this.billingInfo.b_freeText2),
      b_freeText3: new FormControl(this.billingInfo.b_freeText3),
      b_freeText4: new FormControl(this.billingInfo.b_freeText4),
      b_invoiceHeaderImage: new FormControl(this.billingInfo.b_invoiceHeaderImage)
    });

    this.headImg = this.billingInfo.b_invoiceHeaderImage === '/'
      ? 'assets/img/no-image.png' : environmentDefaults.mediaUrl + '/' + this.billingInfo.b_invoiceHeaderImage;
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const body = {
      b_showFooterText: formVals.b_showFooterText ? 'on' : 'off',
      b_showHotelAddress: formVals.b_showHotelAddress ? 'on' : 'off',
      b_freeText1: formVals.b_freeText1,
      b_freeText2: formVals.b_freeText2,
      b_freeText3: formVals.b_freeText3,
      b_freeText4: formVals.b_freeText4,
      b_invoiceHeaderImage: formVals.b_invoiceHeaderImage
    };

    await this.apiBilling.putBillingRequest('apiHotel/billing', body).toPromise();
  }

  public async addImg(): Promise<void> {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    if (!file) {
      return;
    }
    this.uploadingFile(file);
  }

  @Loading(LoaderType.LOAD)
  public async uploadingFile(file: File): Promise<void> {
    const { customerId } = this.authService.getQueryParams();
    const db = this.mainService.getCompanyDetails().dbName;

    await this.apiClient
      .uploadOperationPicture(String(customerId), file, db, 'b_invoiceHeaderImage')
      .toPromise();
    this.init();
  }

  public delImg(): void {
    this.headImg = 'assets/img/no-image.png';
    (this.form.get('b_invoiceHeaderImage') as FormControl).setValue('/');
  }

  ngOnInit(): void {
    this.init();
  }
}

