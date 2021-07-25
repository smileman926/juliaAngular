import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ModalService } from '@/ui-kit/services/modal.service';

import { AuthService } from '@/app/auth/auth.service';
import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { CountryInfoModel } from '@/app/main/models';
import { getLegacyContentUrl } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { EntityOwnerProfile } from '../../models';


@Component({
  selector: 'app-room-owner-details-tab',
  templateUrl: './room-owner-details-tab.component.pug',
  styleUrls: ['./room-owner-details-tab.component.sass']
})
export class RoomOwnerDetailsTabComponent implements OnChanges {

  @Input() entity!: EntityOwnerProfile;
  @Input() countriesList: CountryInfoModel[];
  @Output() initWidget = new EventEmitter();

  form: FormGroup;
  isLoading: Observable<boolean>;
  openStatisticsURL: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private apiCompany: ApiCompanyService,
    private modalService: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_TAB);
    const { customerId, languageId } = this.authService.getQueryParams();
    const rawSrc = getLegacyContentUrl('easybookingConfig/', {cid: customerId, lid: languageId}, 'iframe/roomOwner/statistics');
    this.openStatisticsURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawSrc);
  }

  public init(): void {
    this.form = new FormGroup({
      eo_salutation_id: new FormControl(this.entity.eo_salutation_id),
      eo_title: new FormControl(this.entity.eo_title),
      eo_firstName: new FormControl(this.entity.eo_firstName, Validators.required),
      eo_lastName: new FormControl(this.entity.eo_lastName, Validators.required),
      eo_eMailAddress: new FormControl(this.entity.eo_eMailAddress, Validators.email),
      eo_companyName: new FormControl(this.entity.eo_companyName),
      eo_uidNumber: new FormControl(this.entity.eo_uidNumber),
      eo_companyRegisterNumber: new FormControl(this.entity.eo_companyRegisterNumber),
      eo_iban: new FormControl(this.entity.eo_iban),
      eo_addressLine1: new FormControl(this.entity.eo_addressLine1),
      eo_postCode: new FormControl(this.entity.eo_postCode),
      eo_city: new FormControl(this.entity.eo_city),
      eo_country_id: new FormControl(this.entity.eo_country_id),
      eo_phoneNo: new FormControl(this.entity.eo_phoneNo),
      eo_website: new FormControl(this.entity.eo_website),
      eo_companySeat: new FormControl(this.entity.eo_companySeat),
      eo_companyRegisterCourt: new FormControl(this.entity.eo_companyRegisterCourt),
      eo_bic: new FormControl(this.entity.eo_bic),
      eo_provision: new FormControl(this.entity.eo_provision, Validators.required),
      eo_pinCode: new FormControl(this.entity.eo_pinCode, Validators.required),
    });
  }

  @Loading(LoaderType.LOAD_TAB)
  public async save(): Promise<void> {
    const res = await this.apiCompany.putEntityOwner(this.entity.eo_id, { ...this.form.getRawValue() }).toPromise();
    if ( res ) {
      this.initWidget.emit();
    }
  }

  @Loading(LoaderType.LOAD_TAB)
  public async delete(): Promise<void> {
    const res = await this.apiCompany.deleteEntityOwner(this.entity.eo_id).toPromise();
    if ( res ) {
      this.initWidget.emit();
    }
  }

  public async deleteUser(): Promise<void> {
    if (await this.modalService.openConfirm(
      'ebc.roomOwner.deleteROHeader.text',
      'ebc.roomOwner.deleteROBody.text',
      {
        primaryButtonLabel: 'ebc.buttons.delete.text',
        secondaryButtonLabel: 'ebc.buttons.cancel.text'
      }
    )) {
      this.delete();
    }
  }

  ngOnChanges({ entity }: SimpleChanges): void {
    if ( entity ) {
      this.init();
    }
  }

}
