import { Trigger } from '@/app/main/models';

export interface BillVersionPaymentType {
  bvpt_id: string;
  bvpt_isCashPayment: Trigger;
  bvpt_isCreditCard: Trigger;
  bvpt_name: string;
  bvptl_name: string;
}

export interface SearchBookingForGuestPaymentResult {
  b_billNo: string;
  b_bookingNo: string;
  b_bookingStatus_id: string;
  b_creationDate: Date | string;
  b_id: string;
  b_invoiceDate: Date | string;
  b_prePaymentAmount: string;
  b_prepaymentDate: Date | string;
  billSum: string;
  bill_id: string;
  bv_id: string;
  c_addressLine1: string;
  c_company: string;
  c_country: string;
  c_eMailAddress: string;
  c_firstName: string;
  c_id: string;
  c_lastName: string;
  c_postCodeAndCity: string;
  paymentCount: string;
  sl_salutation: string;
}

export interface SearchBookingForGuestPayment {
  input: {
    customerID: string;
    localeID: string;
    searchValue: string;
  };
  result: SearchBookingForGuestPaymentResult[];
}

export interface GuestPaymentBillVersionPaymentResult {
  isPrepayment: Trigger;
  rc_id: string;
  rc_sendState: string;
}

export interface AddingProductGroup {
  pg_id: string | number;
  pg_name: string;
  pg_sortOrder: string;
  pgl_name: string;
}

export interface AddingProductForGuestPayment {
  p_active: Trigger;
  p_addDefault: Trigger;
  p_channelManagerCode: string;
  p_gross: string;
  p_id: string;
  p_img001: string;
  p_invisible: Trigger;
  p_limitCategory: Trigger;
  p_multipleTax: Trigger;
  p_net: string;
  p_onlineBookable: Trigger;
  p_priceType: string;
  p_productGroup_id: string | number;
  p_productPricingScheme_id: string | number;
  p_productType_id: string | number;
  p_sortOrder: string;
  p_tax: string;
  p_tax_id: string | number;
  pl_name: string;
  pmt_taxPart1: string;
  pmt_taxPart2: string;
  pmt_tax_id1: string | number;
  pmt_tax_id2: string | number;
}

export interface RCITInfo {
  rcit_taxDecimal: string | number;
  rcit_tax_id: string | number;
  rcit_totalGross: number;
  rcit_totalNet: number;
  rcit_totalTax: number;
}

export interface RCIInfo {
  customerId: number;
  localeId: number;
  rci_description: string;
  rci_product_id: string | number;
  rci_totalGross: number;
  rci_totalNet: number;
  rci_totalTax: number;
  rci_unitCount: number;
  rci_unitPriceGross: number;
  rcit: RCITInfo[];
  rci_receipt_id?: string;
}

export interface EditRCIInfo {
  item: RCIInfo;
  index: number;
  lpgId: number | string;
}

