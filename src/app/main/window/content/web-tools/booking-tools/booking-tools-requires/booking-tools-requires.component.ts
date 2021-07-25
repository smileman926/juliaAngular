import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { BookingRequiredFieldsModel, BookingRequiredWithCategoryModel, ForTranslateArry } from '../model';

@Component({
  selector: 'app-booking-tools-requires',
  templateUrl: './booking-tools-requires.component.pug',
  styleUrls: ['./booking-tools-requires.component.sass']
})
export class BookingToolsRequiresComponent implements OnInit {

  form: FormGroup;
  public requiredFields: BookingRequiredFieldsModel[];
  public changedFields: BookingRequiredFieldsModel[];
  public changeableFields: BookingRequiredWithCategoryModel[];
  public currentCategory: string;
  public fiedlsCategory: ForTranslateArry[];
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.requiredFields = [];
    this.changeableFields = [];
    this.changedFields = [];
    this.currentCategory = 'Online Check-In Main Guest';
    this.fiedlsCategory = [
      {
        key: 'Online Check-In Main Guest',
        val: 'ebc.bookingTools.MFG_onlineCheckInMainGuest.text'
      },
      {
        key: 'Online Check-In Additional Persons',
        val: 'ebc.bookingTools.MFG_onlineCheckInFellowGuest.text'
      },
      {
        key: 'Enquiry From',
        val: 'ebc.bookingTools.MFG_enquiryForm.text'
      },
      {
        key: 'Booking Form',
        val: 'ebc.bookingTools.MFG_bookingForm.text'
      },
      {
        key: 'Booking Form With Insurance',
        val: 'ebc.bookingTools.MFG_bookingFormWithER.text'
      }
    ];
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {

    await Promise.all(
      this.changedFields.map( async item =>
        await this.apiHotel.putBookingRequiredFieldsModel(
          item.mf_id,
          {
            mf_display: item.mf_display,
            mf_id: item.mf_id,
            mf_mandatory: item.mf_mandatory
          }
        ).toPromise()
      )
    );

  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.requiredFields = await this.apiHotel.getBookingRequiredFieldsModel().toPromise();

    this.changeableFields.push({
      category: 'Online Check-In Main Guest',
      fields: this.requiredFields.filter( field => Number(field.mf_id) > 31 && Number(field.mf_id) < 62 )
    });
    this.changeableFields.push({
      category: 'Online Check-In Additional Persons',
      fields: this.requiredFields.filter( field => Number(field.mf_id) > 62 && Number(field.mf_id) < 93 )
    });
    this.changeableFields.push({
      category: 'Enquiry From',
      fields: this.requiredFields.filter( field => Number(field.mf_id) > 93 && Number(field.mf_id) < 104 )
    });
    this.changeableFields.push({
      category: 'Booking Form',
      fields: this.requiredFields.filter( field => (Number(field.mf_id) > 103 && Number(field.mf_id) < 114)
      || (Number(field.mf_id) === 124 && field.mf_display === 'on'))
    });
    this.changeableFields.push({
      category: 'Booking Form With Insurance',
      fields: this.requiredFields.filter( field => Number(field.mf_id) > 113 && Number(field.mf_id) < 124
      || (Number(field.mf_id) === 125 && field.mf_display === 'on'))
    });
    this.form = new FormGroup({
      categoryList: new FormControl('Online Check-In Main Guest')
    });
  }
  selectMandatory(): void {
    const { categoryList } = this.form.getRawValue();
    this.currentCategory = categoryList;
  }

  changeStatus(cat: string, val: BookingRequiredFieldsModel) {
      // tslint:disable-next-line:max-line-length
    const tempModel = (this.changeableFields.find( item => item.category === cat) as BookingRequiredWithCategoryModel).fields.find( item => item.mf_id === val.mf_id) as BookingRequiredFieldsModel;
    tempModel.mf_display = val.mf_display === 'on' ? 'off' : 'on';

    if (!this.changedFields.find( item => item.mf_id === val.mf_id)) {
      this.changedFields.push(val);
    }
  }

  changeMandatoryStatus(cat: string, val: BookingRequiredFieldsModel) {
    // tslint:disable-next-line:max-line-length
    const tempModel = (this.changeableFields.find( item => item.category === cat) as BookingRequiredWithCategoryModel).fields.find( item => item.mf_id === val.mf_id) as BookingRequiredFieldsModel;
    if ( cat === 'Online Check-In Main Guest' || cat === 'Online Check-In Additional Persons' ) {
      if (val.mf_mandatory === 'off') {
        tempModel.mf_display = 'on';
      }
    }

    tempModel.mf_mandatory = val.mf_mandatory === 'on' ? 'off' : 'on';

    if (!this.changedFields.find( item => item.mf_id === val.mf_id)) {
      this.changedFields.push(val);
    }
  }

  getTranslation(fieldName: string): string {
    let translatedOne = '';
    switch (fieldName) {
      case 'c_salutation_id':
        translatedOne = 'ebc.forms.salutation.text';
        break;
      case 'c_title':
        translatedOne = 'ebc.forms.title.text';
        break;
      case 'c_firstName':
        translatedOne = 'ebc.forms.firstName.text';
        break;
      case 'c_lastName':
        translatedOne = 'ebc.forms.lastName.text';
        break;
      case 'c_addressLine1':
        translatedOne = 'ebc.invoiceSettings.addressLine1.text';
        break;
      case 'c_addressLine1Plus':
        translatedOne = 'ebc.bookingTools.MF_addressLine1Plus.text';
        break;
      case 'c_postCode':
        translatedOne = 'ebc.forms.postCode.text';
        break;
      case 'c_city':
        translatedOne = 'ebc.forms.city.text';
        break;
      case 'c_cityPlus':
        translatedOne = 'ebc.bookingTools.MF_cityPlus.text';
        break;
      case 'c_region':
        translatedOne = 'ebc.bookingTools.MF_region.text';
        break;
      case 'c_nationality_id':
        translatedOne = 'ebc.bookingTools.MF_nationality.text';
        break;
      case 'c_country_id':
        translatedOne = 'ebc.forms.country.text';
        break;
      case 'c_birthDay':
        translatedOne = 'ebc.bookingTools.MF_birthDay.text';
        break;
      case 'c_birthCity':
        translatedOne = 'ebc.bookingTools.MF_birthCity.text';
        break;
      case 'c_documentType_id':
        translatedOne = 'ebc.bookingTools.MF_documentType.text';
        break;
      case 'c_documentNo':
        translatedOne = 'ebc.bookingTools.MF_documentNo.text';
        break;
      case 'c_postBox':
        translatedOne = 'ebc.bookingTools.MF_postBox.text';
        break;
      case 'c_company':
        translatedOne = 'ebc.forms.company.text';
        break;
      case 'c_taxNo':
        translatedOne = 'ebc.forms.uidNumber.text';
        break;
      case 'c_companyRegNo':
        translatedOne = 'ebc.forms.companyRegisterNumber.text';
        break;
      case 'b_comment':
        translatedOne = 'ebc.forms.comment.text';
        break;
      case 'c_occupation':
        translatedOne = 'ebc.bookingTools.MF_occupation.text';
        break;
      case 'c_occupationBranch':
        translatedOne = 'ebc.bookingTools.MF_occupationBranch.text';
        break;
      case 'c_phoneNo':
        translatedOne = 'ebc.forms.phone.text';
        break;
      case 'c_faxNo':
        translatedOne = 'ebc.hotelManagement.general_fax.text';
        break;
      case 'c_eMailAddress':
        translatedOne = 'ebc.forms.email.text';
        break;
      case 'c_webUrl':
        translatedOne = 'ebc.forms.website.text';
        break;
      case 'cbrf_arrivalMethod_id':
        translatedOne = 'ebc.bookingTools.MF_arrivalMethod.text';
        break;
      case 'c_carRegNo':
        translatedOne = 'ebc.bookingTools.MF_carRegNo.text';
        break;
      case 'cbrf_visitReason_id':
        translatedOne = 'ebc.bookingTools.MF_visitReason.text';
        break;
      case 'cc_characteristics':
        translatedOne = 'ebc.bookingTools.MF_characteristics.text';
        break;
      case 'b_actionCode':
        translatedOne = 'ebc.bookingTools.MF_actionCode.text';
        break;
      default:
        break;
    }
    return translatedOne;
  }

  ngOnInit(): void {
    this.init();
  }

}
