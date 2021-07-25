import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { CorporateIdentityListModel, CorporateIdentityModel } from '../model';

@Component({
  selector: 'app-booking-tools-layout',
  templateUrl: './booking-tools-layout.component.pug',
  styleUrls: ['./booking-tools-layout.component.sass']
})
export class BookingToolsLayoutComponent implements OnInit {

  form: FormGroup;
  public corIdentity: CorporateIdentityModel;
  public corIdentityList: CorporateIdentityListModel;
  public isLoading: Observable<boolean>;


  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  decimalToColor(decimal: string): string {
    let hex = Number(decimal).toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    return '#' + hex;
  }

  colorToDecimal(color: string): string {
    return parseInt(color.replace('#', ''), 16).toString();
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const body = {
      ci_juliaName: this.form.getRawValue().ci_juliaName,
      ci_mainColor: this.colorToDecimal(this.corIdentityList.ci_mainColor),
      ci_fontColor: this.colorToDecimal(this.corIdentityList.ci_fontColor),
      ci_otherColor: this.colorToDecimal(this.corIdentityList.ci_otherColor)
    };
    await this.apiHotel.putCorporateIdentityModel(this.corIdentityList.ci_id, body).toPromise();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.corIdentity = await this.apiHotel.getCorporateIdentityModel().toPromise();
    this.corIdentityList = this.corIdentity[0];
    this.corIdentityList.ci_mainColor = this.decimalToColor(this.corIdentityList.ci_mainColor);
    this.corIdentityList.ci_fontColor = this.decimalToColor(this.corIdentityList.ci_fontColor);
    this.corIdentityList.ci_otherColor = this.decimalToColor(this.corIdentityList.ci_otherColor);

    this.form = new FormGroup({
      ci_juliaName: new FormControl(this.corIdentityList.ci_juliaName, Validators.required)
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
