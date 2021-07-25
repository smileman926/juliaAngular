export interface PaymentMethodModel {
  pm_accountId: string;
  pm_accountLogo: string;
  pm_active: string;
  pm_billVersionPaymentType_id: string;
  pm_chargeGross: string;
  pm_chargeNet: string;
  pm_chargePercOfTotalGross: string;
  pm_chargeTax: string;
  pm_currency_id: string;
  pm_deactivatedBySystem: string;
  pm_id: string;
  pm_name: string;
  pm_notificationPassword: string;
  pm_projectId: string;
  pm_projectPassword: string;
  pm_providerLogo: string;
  pm_providerName: string;
}

export interface CurrencyTypeModel {
  c_exchangeRate: string;
  c_id: string;
  c_isoCode: string;
  c_name: string;
  c_rounding: string;
  c_symbol: string;
  c_symbolPosition: string;
}

export interface PaymentMethodLocaleModel {
  pmal_chargeText: string;
  pmal_desc: string;
  pmal_genericTemplateText: string;
  pmal_genericTemplateText2: string;
  pml_id: string;
  pml_locale_id: string;
  pml_name: string;
  pml_paymentMethod_id: string;
}

export interface TranslateTextGroupModel {
  id: string;
  language: string;
  value: PaymentMethodLocaleModel;
}

export interface PaymentMethodCountryModel {
  pmc_country_id: string;
  pmc_id: string;
  pmc_paymentMethod_id: string;
}

export interface CreditCardTypeModel {
  cct_active: string;
  cct_id: string;
  cct_name: string;
}

export interface CustomPaymentTypeModel {
  id: number;
  bvpt_active: string;
  bvpt_id: string;
  bvpt_isCashPayment: string;
  bvpt_name: string;
  locales: PaymentTypeLocale[];
  display_name: string;
}

interface PaymentTypeLocale {
  bvptl_locale_id: string;
  bvptl_name: string;
}


