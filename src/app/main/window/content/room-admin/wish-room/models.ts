import { Trigger } from '@/app/main/models';

export interface WishRoomData {
  config: WishRoomConfig;
  customerId: number;
  entityGroups: WishRoomEntityGroup[];
  floors: WishRoomFloor[];
  localeId: number;
  locales: WishRoomLocale[];
  seasonPeriods: WishRoomSeasonPeriod[];
  spegps: WishRoomSpegp;
  texts: WishRoomText;
}

export interface WishRoomConfig {
  wc_active: Trigger;
  wc_crossCategorySelectionActive: Trigger;
  wc_id: string;
  wc_pricePerNightActive: Trigger;
  wc_showFloors: Trigger;
  wc_showHint: Trigger;
  wc_showPriceInCartOnly: Trigger;
}

interface WishRoomEntity {
  e_id: string;
  e_sortOrder: string;
  e_uniqueNo: string;
}

interface WishRoomEntityGroup {
  eg_id: string;
  eg_name: string;
  eg_sortOrder: string;
  entities: WishRoomEntity[];
}

interface WishRoomFloorLocale {
  wfl_id: string;
  wfl_locale_id: string;
  wfl_text: string;
  wfl_wrmFloor_id: string;
}

interface WishRoomFloor {
  areas: any[];
  locales: WishRoomFloorLocale[];
  wf_id: string;
  wf_origPicHeight: string;
  wf_origPicWidth: string;
  wf_picPath: string;
}

interface WishRoomLocale {
  feLocale: boolean;
  l_active: Trigger;
  l_desc: string;
  l_icon: string;
  l_id: string;
  l_name: string;
  l_nameDisplay: string;
}

interface WishRoomSeasonPeriod {
  sp_fromDate: Date | string;
  sp_id: string;
  sp_name: string;
  sp_untilDate: Date | string;
  tooltip: Date | string;
}

interface WishRoomSpegpItem {
  id: string;
  price: number;
}

interface WishRoomSpegp {
  [field: string]: WishRoomSpegpItem[];
}

export interface WishRoomTextDescription {
  wtl_id: string;
  wtl_locale_id: string;
  wtl_text: string;
  wtl_wrmText_id: string;
}

export interface WishRoomTextHint {
  wtl_id: string;
  wtl_locale_id: string;
  wtl_text: string;
  wtl_wrmText_id: string;
}

export interface WishRoomTextName {
  wtl_id: string;
  wtl_locale_id: string;
  wtl_text: string;
  wtl_wrmText_id: string;
}

export interface WishRoomTextProductName {
  wtl_id: string;
  wtl_locale_id: string;
  wtl_text: string;
  wtl_wrmText_id: string;
}

export interface WishRoomText {
  description: WishRoomTextDescription[];
  hint: WishRoomTextHint[];
  name: WishRoomTextName[];
  productName: WishRoomTextProductName[];
}
