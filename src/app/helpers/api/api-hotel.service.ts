import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '@/app/helpers/api/api.service';
import { CountryInfoModel } from '@/app/main/models';

import { RawCustomerItemDetails } from '@/app/main/window/content/administration/customers/models';
import {
  AddingProductForGuestPayment,
  AddingProductGroup,
  BillVersionPaymentType,
  GuestPaymentBillVersionPaymentResult,
  SearchBookingForGuestPayment } from '@/app/main/window/content/billing/add-guest-payments/models';
import { EnquiryPoolSettingsModel } from '@/app/main/window/content/channel-management/enquiry-pool-settings/model';
import {
  CancellationLocaleModel,
  CompanyInfoModel,
  DateFormatModel,
  EmailTemplateModel,
  TermsAndConditionsModel,
  WorkflowModel,
  WorkflowVariableModel } from '@/app/main/window/content/my-company/operation-settings/models';
import { WishRoomData } from '@/app/main/window/content/room-admin/wish-room/models';
import {
  BookingEntityGroupModel,
  BookingRequiredFieldsModel,
  BookingSeasonPeriodModel,
  BookingTextTranslateModel,
  CorporateIdentityModel,
  LocaleCodeQueryModel,
  LocalInfoModel,
  MandatoryFieldsModel,
  SaraEmailTemplatesModel,
  SaraSettingsModel,
  ThankyouPagePartnerModel} from '@/app/main/window/content/web-tools/booking-tools/model';

@Injectable({
  providedIn: 'root',
})
export class ApiHotelService {
  constructor(
    private apiService: ApiService) {}

  public updateSara(postData: { [field: string]: any }): Observable<void> {
    return this.apiService.easybookingPost<void>(
      'apiHotel/saraSettings',
      postData
    );
  }

  public getGlobalCustomerInfo(dbName: string): Observable<RawCustomerItemDetails> {
    return this.apiService.globalCustomerInfoGet<RawCustomerItemDetails>(`apiGlobal/Customer/${dbName}/0`);
  }

  public getCompanyModel(): Observable<CompanyInfoModel> {
    return this.apiService.easybookingGet<CompanyInfoModel>('apiHotel/company');
  }

  public putCompanyModel(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/company',
      '1',
      postData
    );
  }

  public getBookingRequiredFieldsModel(): Observable<BookingRequiredFieldsModel[]> {
    return this.apiService.easybookingGet<BookingRequiredFieldsModel[]>('apiHotel/mandatoryFields');
  }

  public putBookingRequiredFieldsModel(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/mandatoryFields',
      id,
      postData
    );
  }

  public getBookingEntityGroupModel(): Observable<BookingEntityGroupModel[]> {
    return this.apiService.easybookingGet<BookingEntityGroupModel[]>('apiHotel/entityGroup');
  }

  public putBookingEntityGroupModel(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/entityGroup',
      id,
      postData
    );
  }

  public getBookingSeasonPeriodModel(): Observable<BookingSeasonPeriodModel[]> {
    return this.apiService.easybookingGet<BookingSeasonPeriodModel[]>('apiHotel/seasonPeriod');
  }

  public putBookingSeasonPeriodModel(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/seasonPeriod',
      id,
      postData
    );
  }

  public getSaraSettingsModel(): Observable<SaraSettingsModel> {
    return this.apiService.easybookingGet<SaraSettingsModel>('apiHotel/SaraSettings', undefined, undefined, 'getCompanyDetails');
  }

  public getSaraEmailTemplatesModel(): Observable<SaraEmailTemplatesModel[]> {
    return this.apiService.easybookingGet<SaraEmailTemplatesModel[]>(
      'apiHotel/SaraCustomEmailVariableLocale', undefined, undefined, 'getCompanyDetails');
  }

  public getCorporateIdentityModel(): Observable<CorporateIdentityModel> {
    return this.apiService.easybookingGet<CorporateIdentityModel>('apiHotel/corporateIdentity', undefined, undefined, 'getCompanyDetails');
  }

  public putCorporateIdentityModel(
    ciID: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/corporateIdentity',
      ciID,
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public getCompanyBookingModel(): Observable<CompanyInfoModel> {
    return this.apiService.easybookingGet<CompanyInfoModel>('apiHotel/company', undefined, undefined, 'getCompanyDetails');
  }

  public putCompanyBookingModel(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/company',
      '1',
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public getEnquiryPoolSettingsModel(): Observable<EnquiryPoolSettingsModel> {
    return this.apiService.easybookingGet<EnquiryPoolSettingsModel>(
      'apiHotel/enquiryPoolSettings',
      undefined,
      undefined,
      'getCompanyDetails');
  }

  public putEnquiryPoolSettingsModel(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.enquiryPoolSettingsPut<{ [field: string]: any }>(
      'apiHotel/enquiryPoolSettings',
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public getBookingTextTranslateModel(id: string): Observable<BookingTextTranslateModel[]> {
    return this.apiService.getBookingToolsTexts<BookingTextTranslateModel[]>('apiHotel/frontEnds', id);
  }

  public putBookingTextTranslateModel(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/frontEndTemplateLocale',
      id,
      postData
    );
  }

  public getCIdAndLId(): string {
    return this.apiService.easybookingCIdAndLId();
  }

  public getLocaleInfoModel(): Observable<LocalInfoModel[]> {
    return this.apiService.easybookingGet<LocalInfoModel[]>('apiHotel/locale', undefined, 'all', 'getCompanyDetails');
  }

  public putLocaleInfoModel(
    lId: string,
    postData: {
      [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/locale',
      lId,
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public getLocaleCodeQueryModel(): Observable<LocaleCodeQueryModel[]> {
    return this.apiService.easybookingGet<LocaleCodeQueryModel[]>('apiHotel/customField');
  }

  public putLocaleCodeQueryModel(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/customField',
      '1',
      postData
    );
  }

  public getThankyouPartnerModel(): Observable<ThankyouPagePartnerModel[]> {
    return this.apiService.easybookingGet<ThankyouPagePartnerModel[]>('apiHotel/thankYouPagePartner');
  }

  public putThankyouPartnerModel(
    id: string,
    postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/thankYouPagePartner',
      id,
      postData
    );
  }

  public getMandatoryFieldsModel(): Observable<MandatoryFieldsModel[]> {
    return this.apiService.easybookingGet<MandatoryFieldsModel[]>('apiHotel/mandatoryFields');
  }

  public getEmailTemplateModel(): Observable<EmailTemplateModel> {
    return this.apiService.easybookingGet<EmailTemplateModel>('apiHotel/emailTemplate', undefined, undefined, 'getCompanyDetails');
  }

  public putEmailTemplateModel(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/emailTemplate',
      '1',
      postData,
      undefined,
      undefined,
      'getCompanyDetails'
    );
  }

  public postSaraSettingsModel(
    propsData: {
    [field: string]: any;
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.saraSettingsPost(
      'apiHotel/SaraSettings',
      propsData,
      undefined,
      'getCompanyDetails'
    );
  }

  public postSaraEmailTemplateModel(
    propsData: {
    [field: string]: any;
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.saraSettingsPost(
      'apiHotel/SaraCustomEmailVariableLocale',
      propsData,
      true,
      'getCompanyDetails'
    );
  }

  public postGeneratePassword(): Observable<{ [field: string]: any }> {
    return this.apiService.saraGeneratePassword();
  }

  public postTestEmailModel(formData: FormData): Observable<string> {
    return this.apiService.sendTestEmailPost(
      formData
    );
  }

  public getWorkflowVariableModel(): Observable<WorkflowVariableModel[]> {
    return this.apiService.easybookingGet<WorkflowVariableModel[]>('apiHotel/workflowVariable');
  }

  public putWorkflowVariableModel(
    wvID: string,
    postData: {
      [field: string]: any
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/workflowVariable',
      wvID,
      postData
    );
  }

  public getCountryInfoModel(): Observable<CountryInfoModel[]> {
    return this.apiService.easybookingGet<CountryInfoModel[]>('apiHotel/country');
  }

  public getDateFormatListModel(): Observable<DateFormatModel[]> {
    return this.apiService.easybookingDateFormatGet<DateFormatModel[]>('apiHotel/dateFormat');
  }

  public getWorkflowModel(): Observable<WorkflowModel[]> {
    return this.apiService.easybookingGet<WorkflowModel[]>('apiHotel/workflow');
  }

  public putWorkflowModel(
    wvID: string,
    postData: {
      [field: string]: any
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/workflow',
      wvID,
      postData
    );
  }

  public getTermsAndConditionsModel(): Observable<TermsAndConditionsModel[]> {
    return this.apiService.easybookingGet<TermsAndConditionsModel[]>('apiHotel/termsConditionsLocale');
  }

  public putTermsAndConditionsModel(
    wvID: string,
    postData: {
      [field: string]: any
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/termsConditionsLocale',
      wvID,
      postData
    );
  }

  public getCancellationLocaleModel(): Observable<CancellationLocaleModel[]> {
    return this.apiService.easybookingGet<CancellationLocaleModel[]>('apiHotel/cancellationLocale');
  }

  public putCancellationLocaleModel(
    wvID: string,
    postData: {
      [field: string]: any
    }
  ): Observable<{ [field: string]: any }> {
    return this.apiService.operationSettingPut<{ [field: string]: any }>(
      'apiHotel/cancellationLocale',
      wvID,
      postData
    );
  }

  // Add Guest Payments

  public postSearchBookingForGuestPayment(
    propsData: FormData
  ): Observable<SearchBookingForGuestPayment> {
    return this.apiService.saraSettingsPost<SearchBookingForGuestPayment>(
      'apiHotel/searchBookingForGuestPayment',
      propsData,
    );
  }

  public getBillVersionPaymentType(): Observable<BillVersionPaymentType[]> {
    return this.apiService.easybookingGet<BillVersionPaymentType[]>('apiHotel/billVersionPaymentType');
  }

  public postGuestPaymentBillVersionPayment(
    propsData: {
    [field: string]: any;
    }
  ): Observable<GuestPaymentBillVersionPaymentResult> {
    return this.apiService.saraSettingsPost(
      'apiHotel/guestPaymentBillVersionPayment',
      propsData
    );
  }

  public getBillingInvoicePDF(
    billID: number,
    id: number
  ): Observable<{ [field: string]: any }> {
    return this.apiService
      .mainApiPost<{ [field: string]: any }>(
        [billID, id, 'appUser'],
        'Billing',
        'generateBillVersionPDF'
      );
  }

  public getAddingProductGroup(): Observable<AddingProductGroup[]> {
    return this.apiService.easybookingGet<AddingProductGroup[]>('apiHotel/productGroup');
  }

  public getAddingProductForGuestPayment(): Observable<AddingProductForGuestPayment[]> {
    return this.apiService.easybookingGet<AddingProductForGuestPayment[]>('apiHotel/productForGuestPayments');
  }

  public postAddingProductForGuestPayments(postData: { [field: string]: any }): Observable<AddingProductForGuestPayment> {
    return this.apiService.easybookingPost<AddingProductForGuestPayment>(
      'apiHotel/productForGuestPayments',
      postData
    );
  }

  public postReceipt(postData: { [field: string]: any }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPost<{ [field: string]: any }>(
      'apiHotel/receipt',
      postData
    );
  }

  public postReceiptItem(postData: { [field: string]: any }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPost<{ [field: string]: any }>(
      'apiHotel/receiptItem',
      postData
    );
  }

  public postReceiptPayment(postData: { [field: string]: any }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPost<{ [field: string]: any }>(
      'apiHotel/receiptPayment',
      postData
    );
  }

  public putReceiptSignature(postData: {
    [field: string]: any;
  }): Observable<{ [field: string]: any }> {
    return this.apiService.easybookingPut<{ [field: string]: any }>(
      'apiHotel/receiptSignature',
      postData
    );
  }

  public sendReceipt(
    rcId: number,
    email: string
  ): Observable<{ [field: string]: any }> {
    return this.apiService
      .mainApiPost<{ [field: string]: any }>(
        [rcId, email, 'appUser'],
        'BillVersionPayment',
        'emailPaymentConfirmationFromReceipt'
      );
  }

  public getWishRoomData(): Observable<WishRoomData> {
    return this.apiService.easybookingGet<WishRoomData>('apiHotel/wrmData');
  }
}
