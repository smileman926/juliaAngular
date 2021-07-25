interface PortalAATDataCategories {
  active: boolean;
  c_code: string;
  c_id: string;
  c_name: string;
}

interface PortalAATDataCustomer {
  c_aatContentStatus: string;
  c_aatLastApproved: string;
  c_id: string;
  c_sugarId: string;
}

interface PortalAATDataDescriptions {
  cd_locale_id: string;
  cd_shortDescription: string;
  l_name: string;
}

interface PortalAATDataFacilities {
  active: boolean;
  f_code: string;
  f_id: string;
  f_name: string;
}

export interface PortaLAATDataImagies {
  id?: number;
  ci_fileSize: string;
  ci_id: string;
  ci_isMain: boolean;
  ci_path: string;
  ci_sortOrder: string;
  deleted: boolean;
}

interface PortalAATDataLocations {
  active: boolean;
  l_code: string;
  l_id: string;
  l_name: string;
}

export interface PortalAATDataInfo {
  categories: PortalAATDataCategories[];
  customer: PortalAATDataCustomer;
  descriptions: PortalAATDataDescriptions[];
  facilities: PortalAATDataFacilities[];
  images: PortaLAATDataImagies[];
  locations: PortalAATDataLocations[];
  purchasedProducts: [];
  regions: [];
}
