import { InjectionToken } from '@angular/core';

export interface AppSettings {
  title: string;
  version: string;
  backendVersion: string;
  apiUrl: string;
}

export const appSetting: AppSettings = {
  title: 'Art, inc',
  version: '1.0.0',
  backendVersion: 'v1',
  apiUrl: 'http://localhost:4100/api',
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.setting');
