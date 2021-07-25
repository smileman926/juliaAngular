import {
  Catering, CateringDetails,
  CompanyCateringConfig,
  RawCatering, RawCateringDetails,
  RawCompanyCateringConfig
} from '@/app/main/window/content/pricing-admin/catering-settings/models';

export function reduceCompanyCateringConfig(d: RawCompanyCateringConfig): CompanyCateringConfig {
  return {
    id: +d.c_id,
    methodDefaultCatering: d.c_methodDefaultCatering,
    methodOtherCatering: d.c_methodOtherCatering
  };
}

export function reduceCaterings(d: RawCatering): Catering {
  return {
    id: +d.st_id,
    localName: d.stl_name,
    active: d.st_active === 'on',
    name: d.st_name
  };
}

export function reduceCateringDetails(d: RawCateringDetails): CateringDetails {
  return {
    catering: d.catering ? d.catering.map((c: RawCateringDetails['catering'][0]) => ({
      id: +c.cst_catering_id,
      serviceTypeId: +c.cst_serviceType_id
    } as CateringDetails['catering'][0])) : [],
    serviceTypeLocale: d.serviceTypeLocale ? d.serviceTypeLocale.map((l: RawCateringDetails['serviceTypeLocale'][0]) => ({
      id: +l.stl_id,
      serviceTypeId: +l.stl_serviceType_id,
      localeId: +l.stl_locale_id,
      name: l.stl_name
    } as CateringDetails['serviceTypeLocale'][0])) : [],
    active: d.st_active === 'on',
    id: +d.st_id,
    name: d.st_name,
    price: +d.st_price,
    sortOrder: d.st_sortOrder
  }
}
