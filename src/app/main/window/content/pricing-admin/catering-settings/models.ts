import { Trigger } from '@/app/main/models';
import { FormControl } from '@angular/forms';

export interface RawCompanyCateringConfig {
  c_id: string;
  c_methodDefaultCatering: 'fixed' | 'quota';
  c_methodOtherCatering: 'absolute' | 'relative';
}

export interface CompanyCateringConfig {
  id: number;
  methodDefaultCatering: 'fixed' | 'quota';
  methodOtherCatering: 'absolute' | 'relative';
}

export interface RawCatering {
  st_id: string;
  stl_name: string;
  st_active: Trigger;
  st_name: string;
}

export interface Catering {
  id: number;
  localName: string;
  active: boolean;
  name: string;
}

export interface CateringSettingsFormBody {
  active: boolean;
  afternoon: boolean;
  allIncl: boolean;
  breakfast: boolean;
  dinner: boolean;
  lunch: boolean;
  language: number;
  methodDefaultCatering: 'fixed' | 'quota';
  methodOtherCatering: 'absolute' | 'relative';
  name: string;
}

export interface RawCateringDetails {
  catering: {
    cst_catering_id: string;
    cst_serviceType_id: string;
  }[];
  serviceTypeLocale: {
    stl_id: string,
    stl_serviceType_id: string;
    stl_locale_id: string;
    stl_name: string;
  }[];
  st_active: Trigger;
  st_id: string;
  st_name: string;
  st_price: string;
  st_sortOrder: string;
}

export interface CateringDetails {
  catering: {
    id: number;
    serviceTypeId: number;
  }[];
  serviceTypeLocale: {
    id: number | null,
    serviceTypeId: number;
    localeId: number;
    name: string;
  }[];
  active: boolean;
  id: number;
  name: string;
  price: number;
  sortOrder: string;
}

export interface SaveCateringResponse {
  cstInsertedCount?: number;
  stActiveChanged?: number;
  stlUpdated?: number;
  stActiveError?: Trigger;
  spepInsertedCount?: number;
  tmpTblCreatedCount?: number;
  tmpTblDeletedCount?: number;
  updatedCount?: number;
}

export enum CATERINGTYPE {
  BREAKFAST = 5,
  LUNCH = 6,
  AFTERNOON = 7,
  DINNER = 8,
  ALLINCL = 9
}
