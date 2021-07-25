import { Trigger } from '@/app/main/models';

export interface BillingGeneralModel {
  b_addressLine1: string;
  b_addressLine1_2: string;
  b_billNoFormat: string;
  b_catering: Trigger;
  b_city: string;
  b_cleanupCharge: Trigger;
  b_companyName: string;
  b_companyName_2: string;
  b_cotCharge: Trigger;
  b_country_id: string;
  b_earlyBirdDiscount: Trigger;
  b_freeText1: string;
  b_freeText2: string;
  b_freeText3: string;
  b_freeText4: string;
  b_garage: Trigger;
  b_id: string;
  b_initBillnoAtBeginningOfYear: Trigger;
  b_invoiceHeaderImage: string;
  b_lastMinuteDiscount: Trigger;
  b_longStayDiscount: Trigger;
  b_otherCharges: Trigger;
  b_petCharge: Trigger;
  b_postCode: string;
  b_receiptAddressType: string;
  b_receiptFormat: string;
  b_shortStayCharge: Trigger;
  b_showFooterText: Trigger;
  b_showHotelAddress: Trigger;
  b_showQrCode: Trigger;
  b_showRoomNo: Trigger;
  b_showSplitBillsByDefault: Trigger;
  b_showTaxTable: Trigger;
  b_showVisitorsTaxInfo: Trigger;
  b_visitorsTax: Trigger;
  b_wishroomCharge: Trigger;
}

export interface BillingDefaultTextModel {
  bdt_locale_id: string;
  bdt_text: string;
}

export interface TranslateTextGroupModel {
  id: string;
  language: string;
  value: string;
}

export interface TaxPeriodModel {
  isCurrentPeriod?: boolean;
  tp_autoSaved?: string;
  tp_created?: Date | string;
  tp_description: string;
  tp_from: Date | string;
  tp_id: string;
  tp_splitFoodAndBeverage?: string;
  tp_until: Date | string | null;
}

export interface CateringModel {
  st_active: Trigger;
  st_id: string;
  st_name: string;
  stl_name: string;
}

interface FoodAndBeverageSplitModel {
  localisedName: string;
  st_id: string;
  sttp_foodBeverageSplit: string;
  sttp_taxationPeriod_id: string;
}

interface TaxationTableModel {
  t_description: string;
  t_id: string;
  t_name: string;
  t_tax_id: string;
  t_taxationPeriod_id: string;
}
export interface TaxationV2Model {
  splitFoodAndBeverage: FoodAndBeverageSplitModel[];
  taxationTable: TaxationTableModel[];
}
