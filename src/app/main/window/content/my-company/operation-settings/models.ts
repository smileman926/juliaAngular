export interface CompanyInfoModel {
  0: CompanyInfoListModel;
}

export interface CompanyInfoListModel {
  c_id: string;
  c_name: string;
  c_contactName: string;
  c_addressLine1: string;
  c_addressLine2: string;
  c_addressLine3: string;
  c_city: string;
  c_postCode: string;
  c_country: string;
  c_tel: string;
  c_fax: string;
  c_webSite: string;
  c_iframedWebsiteURL: string;
  c_eMail: string;
  c_logo: string;
  c_pic01: string;
  c_pic02: string;
  c_beRoomLevelPricingEnabled: string;
  c_feShowRoomDetail: string;
  c_feShowRoomCalendar: string;
  c_feShowRoomNumbers: string;
  c_feShowRoomPrice: string;
  c_feLocale_id: string;
  c_feNoOfRoomsPerCategory: string;
  c_feNewsletterEnabled: string;
  c_feMaxNoOfRooms: string;
  c_visitorsTaxEnabled: string;
  c_visitorsTaxIncluded: string;
  c_taxNo: string;
  c_bankName: string;
  c_accountHolder: string;
  c_accountNumber: string;
  c_bankNumber: string;
  c_iban: string;
  c_swift: string;
  c_district: string;
  c_tel2: string;
  c_eBLink: string;
  c_initWizardDate: string;
  c_loginDB: string;
  c_gapFillEnabled: string;
  c_lastMinutesEnabled: string;
  c_cancellationEnabled: string;
  c_termsConditionsEnabled: string;
  c_prePaymentActive: string;
  c_prePaymentDaysAfterBooking: string;
  c_prePaymentUntilDaysBeforeBookingActive: string;
  c_prePaymentUntilDaysBeforeBooking: string;
  c_prePaymentPerc: string;
  c_prePaymentHideBankTransfer: string;
  c_useCustomSMTP: string;
  c_smtpServer: string;
  c_smtpUserName: string;
  c_smtpPassword: string;
  c_smtpFromName: string;
  c_smtpFromEMail: string;
  c_smtpReplyToName: string;
  c_smtpReplyToEMail: string;
  c_smtpPort: string;
  c_smtpSsl: string;
  c_smtpTls: string;
  c_currency_id: string;
  c_invisibleBookingHistory: string;
  c_blockColor: string;
  c_taxEnabled: string;
  c_defaultTax_id: string;
  c_billingEnabled: string;
  c_specialOfferEnabled: string;
  c_poweredByEnabled: string;
  c_holidayCheckId: string;
  c_holidayCheckEnabled: string;
  c_specialOfferTabPosition: string;
  c_invoiceCreatedIndicatorColor: string;
  c_channelAllocationColor: string;
  c_fbShareURL: string;
  c_facebookUrl: string;
  c_twitterUrl: string;
  c_youtubeUrl: string;
  c_googlePlusUrl: string;
  c_beShowEnquiries: string;
  c_beShowBlocks: string;
  c_epSettingFormDayTolerance: string;
  c_epSettingManualAssignDayTolerance: string;
  c_epSettingAutoAnswerComment: string;
  c_epSettingAutoAnswerDeskline: string;
  c_epSettingAutoAnswerEnquiryForm: string;
  c_epSettingSplitToMultipleRooms: string;
  c_displayVisitorsTax: string;
  c_displayCleanupCharge: string;
  c_displayPetCharge: string;
  c_displayCotCharge: string;
  c_displayCatering: string;
  c_displayGarage: string;
  c_displayEarlyBirdDiscount: string;
  c_displayLongStayDiscount: string;
  c_displayOtherCharges: string;
  c_displayShortStayCharge: string;
  c_displayCategoryForSpecialOffer: string;
  c_displayLastMinuteDiscount: string;
  c_timeGapTilArrival: string;
  c_channelManagementActive: string;
  c_showRoomsInFrontend: string;
  c_showSpecialOffersInFrontend: string;
  c_hideCatering: string;
  c_defaultCountry_id: string;
  c_specialOfferDayTolerance: string;
  c_analyticsTrackingCode: string;
  c_notifyAtXNoOfRooms: string;
  c_useRoundingHack: string;
  c_noSplittingOutForSpecialOffers: string;
  c_showCheckin: string;
  c_showCheckout: string;
  c_sendEventsAtOffer: string;
  c_sendEventsAtBooking: string;
  c_sendEventsAtReservation: string;
  c_sendEventsAtGoodJourney: string;
  c_gapFillIgnoreArrival: string;
  c_gapFillIgnoreDeparture: string;
  c_onlyBookableOverSpecialOffersInFrontend: string;
  c_hideSpecialOffersCompletelyInFrontend: string;
  c_websiteUser: string;
  c_websitePass: string;
  c_websitePageId: string;
  c_notObligedToCashRegisterLaw: string;
  c_guestRatingActive: string;
  c_grUseNetworkRatings: string;
  c_grShowRatingInBookingEdit: string;
  c_wishroom_module_active: string;
  c_displayWishroomCharge: string;
  c_beLocale_id: string;
  c_autoSplitCateringRoomcharge: string;
  c_ervAlwaysIncluded: string;
  c_lastGuestReviewCheck: string;
  c_channelManagerAutoCalc: string;
  c_methodDefaultCatering: string;
  c_methodOtherCatering: string;
  c_dateFormat_id: string;
  c_hideDailyTips: string;
  c_autoAnonymizationDays: string;
  c_autoAnonymize: string;
  c_autoAnonymizeEmailToGuest: string;
  c_hideAnonymizedGuests: string;
  c_beShowNarrowLines: string;
  c_defaultRoomplan: string;
  c_urlToEvents: string;
  c_anonymizeIcal: string;
  c_hasFeratelHotelCode: string;
  c_previewLink: string;
  c_hasCashRegisterModule: string;
  currency: {
    c_id: string;
    c_name: string;
    c_symbol: string;
    c_symbolPosition: string;
    c_exchangeRate: string;
    c_rounding: string;
    c_isoCode: string;
  };
  countryLocale: {
    cl_country_id: string;
    cl_locale_id: string;
    cl_name: string;
  };
  wrmProductName: string;
  dbName: string;
  hasFiskaltrustInterface: string;
}
export interface WorkflowVariableModel {
  wv_desc: string;
  wv_id: string;
  wv_name: string;
  wv_value: string;
  wv_workflow_id: string;
}

export interface WorkflowModel {
  w_desc: string;
  w_id: string;
  w_name: string;
  w_value: string;
}

export interface TermsAndConditionsModel {
  tcl_id: string;
  tcl_locale_id: string;
  tcl_termsConditions_id: string;
  tcl_text: null;
  tcl_url: string;
}

export interface CancellationLocaleModel {
  cl_cancellation_id: string;
  cl_id: string;
  cl_locale_id: string;
  cl_value: string;
}

export interface LocaleTranslationModel {
  locale: string;
  id: string;
}

export interface EmailTemplateModel {
  et_id: string;
  et_name: string;
  et_showHotelInfoOnPDF: string;
  et_templateName: string;
  et_templatePath: string;
}

export interface DateFormatModel {
  df_display: string;
  df_format: string;
  df_id: string;
}
