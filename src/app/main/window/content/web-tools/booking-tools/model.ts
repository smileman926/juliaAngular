export interface LocaleCodeQueryModel {
  cf_active: string;
  cf_id: string;
  cf_name: string;
  locales: CodeQueryModel[];
}

export interface CodeQueryModel {
  cfl_customField_id: string;
  cfl_locale_id: string;
  cfl_value: string;
}

export interface MandatoryFieldsModel {
  mf_display: string;
  mf_fieldName: string;
  mf_id: string;
  mf_mandatory: string;
  mf_mandatoryFieldsCategory_id: string;
}

export interface LocalInfoModel {
  l_active: string;
  l_desc: string;
  l_icon: string;
  l_id: string;
  l_name: string;
  l_nameDisplay: string;
}

export interface CorporateIdentityModel {
  0: CorporateIdentityListModel;
}

export interface CorporateIdentityListModel {
  ci_active: string;
  ci_bgColor: string;
  ci_comboAlterColor01: string;
  ci_comboAlterColor02: string;
  ci_comboRollOverColor: string;
  ci_comboSelectionColor: string;
  ci_cornerRadius: string;
  ci_feIntroLineColor: string;
  ci_feIntroTextColor: string;
  ci_feLogo: string;
  ci_feSpecialOfferColor: string;
  ci_fillAlpha01: string;
  ci_fillAlpha02: string;
  ci_fillAlpha03: string;
  ci_fillAlpha04: string;
  ci_fillColor01: string;
  ci_fillColor02: string;
  ci_fillColor03: string;
  ci_fillColor04: string;
  ci_fontColor: string;
  ci_highlightAlpha01: string;
  ci_highlightAlpha02: string;
  ci_id: string;
  ci_juliaImage: string;
  ci_juliaName: string;
  ci_labelTextColor: string;
  ci_mainColor: string;
  ci_name: string;
  ci_otherColor: string;
  ci_priceOMeterButtonFontColor: string;
  ci_priceOMeterButtonMainColor: string;
  ci_priceOMeterCustomFeratelName: string;
  ci_priceOMeterPriceFontColor: string;
  ci_tabColor: string;
  ci_tabColorRollOver: string;
  ci_tabCornerRadius: string;
  ci_tabHorisontalGap: string;
  ci_textColor: string;
  ci_textRollOverColor: string;
  ci_type: string;
}

export interface BookingTextTranslateModel {
  fer_id: string;
  fer_name: string;
  ferl_name: string;
  fetl_id: string;
  fetl_locale_id: string;
  fetl_text: string;
}

export interface BookingTextsModel {
  id: string;
  language: string;
  vals: BookingTextTranslateModel[];
}

export interface BookingTextTranslateInitValueModel {
  id: number;
  type: string;
  pureType: string;
  value: string;
}

export interface BookingRequiredFieldsModel {
  mf_display: string;
  mf_fieldName: string;
  mf_id: string;
  mf_mandatory: string;
  mf_mandatoryFieldsCategory_id: string;
}

export interface BookingRequiredWithCategoryModel {
  category: string;
  fields: BookingRequiredFieldsModel[];
}

export interface BookingSeasonPeriodModel {
  sp_abFri: string;
  sp_abMon: string;
  sp_abSat: string;
  sp_abSun: string;
  sp_abThu: string;
  sp_abTue: string;
  sp_abWed: string;
  sp_allowBooking: string;
  sp_allowEnquiry: string;
  sp_allowReservation: string;
  sp_anFri: string;
  sp_anMon: string;
  sp_anSat: string;
  sp_anSun: string;
  sp_anThu: string;
  sp_anTue: string;
  sp_anWed: string;
  sp_fromDate: string;
  sp_gapFillEnabled: string;
  sp_id: string;
  sp_maxStay: string;
  sp_minStay: string;
  sp_name: string;
  sp_season_id: string;
  sp_untilDate: string;
  sp_useDiscounts: string;
  sp_useLongStayDiscount: string;
  sp_useNightsMultiple: string;
}

export interface BookingEntityGroupModel {
  eg_entityType_id: string;
  eg_gapFillMinStay: string;
  eg_id: string;
  eg_lastActivity: string;
  eg_name: string;
  eg_priceConfirmationComments: string;
  eg_priceConfirmationDate: string;
  eg_priceConfirmationStatus: string;
  eg_recommended: string;
  eg_sortOrder: string;
  eg_thumbSketchPic: string;
  translation: EntityGroupTranslation;
}

interface EntityGroupTranslation {
  egl_value: string;
}

export interface SaraSettingsModel {
  ss_chatSetupHintIgnore: string;
  ss_firebaseEmail: string;
  ss_firebasePasswordChanged: string;
  ss_hideCalltoActionModal: string;
  ss_id: string;
  ss_newDesignReservation: string;
  ss_showAtOnlineCheckin: string;
  ss_showAtThankyouPage: string;
  ss_useCustomEmailVariable: string;
}

export interface SaraEmailTemplatesModel {
  scevl_locale_id: string;
  scevl_text: string;
}

export interface ThankyouPagePartnerModel {
  typp_active: string;
  typp_fromMonth: string;
  typp_id: string;
  typp_name: string;
  typp_untilMonth: string;
}

export interface ForTranslateArry {
  key: string;
  val: string;
}
