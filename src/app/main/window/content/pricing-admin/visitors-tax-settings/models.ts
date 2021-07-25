export interface VistorsScreenSettings {
  locales: LocaleItem[];
  visitorsTax: VisitorTaxItem[];
  visitorsTaxCalculationRule: {
    vtcr_id: string;
    vtcr_name: string;
  }[];
  visitorsTaxChargeType: {
    vtct_id: string;
    vtct_name: string;
  }[];
  c_visitorsTaxEnabled: boolean;
  c_visitorsTaxIncluded: boolean;
}

export interface LocaleItem {
  vtl_locale_id: string;
  vtl_value: string;
}

export interface VisitorTaxItem {
  ageGroupDetails: AgeGroupItem[];
  vt_fromDate: string;
  vt_id: string;
  vt_name: string;
  vt_untilDate: string;
  vt_visitorsTaxCalculationRule_id: string;
  vt_visitorsTaxChargeType_id: string;
}

export interface ReplaceVisitorTaxItem {
  ageGroupDetails: AgeGroupItem[];
  vt_fromDate: Date;
  id: string;
  value: string;
  vt_untilDate: Date;
  vt_visitorsTaxCalculationRule_id: string;
  vt_visitorsTaxChargeType_id: string;
}
export interface AgeGroupItem {
  vtd_from: string | null;
  vtd_id: string;
  vtd_until: string | null;
  vtd_value: number | null;
}
