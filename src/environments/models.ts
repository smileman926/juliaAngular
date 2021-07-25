import { WindowContentSourceProperties } from '@/app/main/window/models';

export interface EnvironmentSettings {
  production: boolean;
  remoteUrl: string;
  apiUrl: string;
  legacyContentUrl: string;
  calendarUrl: string;
  mediaUrl: string;
  mockServer: boolean;
  loginUrl: string;
  startupWindow: string;
  startupWindowParameters: WindowContentSourceProperties;
  livezillaId: string;
  token?: string;
  remoteUrlToSetToken?: string; // use {{TOKEN}} for the placeholder
  defaultCustomerId?: number;
}
