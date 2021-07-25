import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { environmentDefaults } from '@/environments/defaults';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';

import {
  FormDataService,
  FormOption,
} from '@/app/main/shared/form-data.service';

import {
  CompanyInfoListModel,
  CompanyInfoModel
} from '@/app/main/window/content/my-company/operation-settings/models';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
@Component({
  selector: 'app-operation-general',
  templateUrl: './operation-general.component.pug',
  styleUrls: ['./operation-general.component.sass'],
})
export class OperationGeneralComponent implements OnInit {
  form: FormGroup;
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public isLoading: Observable<boolean>;
  public response: { [field: string]: any };
  public pic1: string;
  public pic2: string;
  public locales: FormOption[] = [];
  public defaultLocale: string;

  constructor(
    private authService: AuthService,
    private apiClient: ApiClient,
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private mainService: MainService,
    private formDataService: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INNER_TAB);
    this.locales = this.formDataService.getLocals();
  }

  public async addImage(value: number): Promise<void> {
    let imageType: string;
    if (value === 1) {
      imageType = 'c_pic01';
    } else {
      imageType = 'c_pic02';
    }
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');

    if (!file) {
      return;
    }
    const { customerId } = this.authService.getQueryParams();
    const db = this.mainService.getCompanyDetails().dbName;

    await this.apiClient
      .uploadOperationPicture(String(customerId), file, db, imageType)
      .toPromise();
    this.init();
  }

  deleteImage(value: number): void {
    if (value === 1) {
      this.pic1 = 'assets/img/no-image.png';
      (this.form.get('c_pic01') as FormControl).setValue('/');
    } else {
      this.pic2 = 'assets/img/no-image.png';
      (this.form.get('c_pic02') as FormControl).setValue('/');
    }
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    this.response = await this.apiHotel
      .putCompanyModel({ ...this.form.getRawValue() })
      .toPromise();
    const formVals = this.form.getRawValue();
    if (formVals.c_beLocale_id !== this.defaultLocale) {
      window.location.reload();
    }
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.itemsList = await this.apiHotel.getCompanyModel().toPromise();
    this.items = this.itemsList['0'];
    this.locales = this.locales.filter(
      (item) => item.value === '1' || item.value === '2'
    );
    this.defaultLocale = this.items.c_beLocale_id;
    this.form = new FormGroup({
      c_name: new FormControl(this.items.c_name),
      c_contactName: new FormControl(this.items.c_contactName),
      c_addressLine1: new FormControl(this.items.c_addressLine1),
      c_tel: new FormControl(this.items.c_tel),
      c_postCode: new FormControl(this.items.c_postCode),
      c_tel2: new FormControl(this.items.c_tel2),
      c_city: new FormControl(this.items.c_city),
      c_fax: new FormControl(this.items.c_fax),
      c_eMail: new FormControl(this.items.c_eMail, Validators.email),
      c_country: new FormControl(this.items.c_country),
      c_district: new FormControl(this.items.c_district),
      c_webSite: new FormControl(this.items.c_webSite),
      c_taxNo: new FormControl(this.items.c_taxNo),
      c_iframedWebsiteURL: new FormControl(this.items.c_iframedWebsiteURL),
      c_beLocale_id: new FormControl(this.items.c_beLocale_id),
      c_fbShareURL: new FormControl(this.items.c_fbShareURL),
      c_facebookUrl: new FormControl(this.items.c_facebookUrl),
      c_twitterUrl: new FormControl(this.items.c_twitterUrl),
      c_youtubeUrl: new FormControl(this.items.c_youtubeUrl),
      c_googlePlusUrl: new FormControl(this.items.c_googlePlusUrl),
      c_pic01: new FormControl(this.items.c_pic01),
      c_pic02: new FormControl(this.items.c_pic02),
    });

    this.pic1 =
      this.items.c_pic01 === '/'
        ? 'assets/img/no-image.png'
        : environmentDefaults.mediaUrl + '/' + this.items.c_pic01;
    this.pic2 =
      this.items.c_pic02 === '/'
        ? 'assets/img/no-image.png'
        : environmentDefaults.mediaUrl + '/' + this.items.c_pic02;
  }

  ngOnInit(): void {
    this.init();
  }
}
