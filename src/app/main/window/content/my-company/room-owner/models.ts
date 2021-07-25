import { Trigger } from '@/app/main/models';

export interface EntityOwnerProfile {
  id?: number;
  eo_addressLine1: string;
  eo_bic: string;
  eo_city: string;
  eo_companyName: string;
  eo_companyRegisterCourt: string;
  eo_companyRegisterNumber: string;
  eo_companySeat: string;
  eo_country_id: string;
  eo_eMailAddress: string;
  eo_firstName: string;
  eo_iban: string;
  eo_id: string;
  eo_lastName: string;
  eo_phoneNo: string;
  eo_pinCode: string;
  eo_postCode: string;
  eo_provision: string;
  eo_salutation_id: string;
  eo_title: string;
  eo_uidNumber: string;
  eo_website: string;
}

export interface EntityOwnerRoomInfo {
  eoe_entityOwner_id: string;
  eoe_entity_id: string | number;
  eoe_fromDate?: Date | string | null;
  eoe_id?: string;
  eoe_provision: string;
  eoe_untilDate?: Date | string | null;
  newRecord?: boolean;
}

export interface EntityInfo {
  id?: number;
  e_active: Trigger;
  e_adminOnly: Trigger;
  e_creationDate: Date | string;
  e_entityGroup_id: string;
  e_entityType_id: string;
  e_entity_id: string;
  e_icalSyncDate: Date | string;
  e_id: string | number;
  e_level: string;
  e_name: string;
  e_sortOrder: string;
  e_thumbSketchPic: string;
  e_uniqueNo: string;
}
