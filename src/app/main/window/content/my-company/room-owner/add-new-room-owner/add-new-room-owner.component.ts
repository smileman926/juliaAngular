import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { CountryInfoModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-add-new-room-owner',
  templateUrl: './add-new-room-owner.component.pug',
  styleUrls: ['./add-new-room-owner.component.sass']
})
export class AddNewRoomOwnerComponent implements OnInit {

  form: FormGroup;
  countriesList: CountryInfoModel[];
  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiCompany: ApiCompanyService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_NEW_ROOM_OWNER);
  }

  @Loading(LoaderType.LOAD_NEW_ROOM_OWNER)
  public init(list: CountryInfoModel[]): void {
    this.countriesList = list;
    this.form = new FormGroup({
      eo_salutation_id: new FormControl(''),
      eo_title: new FormControl(''),
      eo_firstName: new FormControl('', Validators.required),
      eo_lastName: new FormControl('', Validators.required),
      eo_eMailAddress: new FormControl('', [Validators.email, Validators.required]),
      eo_addressLine1: new FormControl(''),
      eo_postCode: new FormControl(''),
      eo_city: new FormControl(''),
      eo_country_id: new FormControl('15'),
      eo_phoneNo: new FormControl(''),
      eo_provision: new FormControl(0, Validators.required),
      eo_pinCode: new FormControl('', Validators.required),
    });
  }

  @Loading(LoaderType.LOAD_NEW_ROOM_OWNER)
  public async save(): Promise<boolean> {
    if ( this.form.invalid ) {
      return false;
    } else {
      const res = await this.apiCompany
      .postEntityOwner({ ...this.form.getRawValue() })
      .toPromise();
      if (res) {
        return true;
      } else {
        return false;
      }
    }
  }

  ngOnInit(): void { }

}
