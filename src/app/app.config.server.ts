import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_SETTINGS, appSetting } from './app.setting';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: APP_SETTINGS, useValue: appSetting },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
