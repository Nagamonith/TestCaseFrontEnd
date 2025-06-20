import { bootstrapApplication } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { Component } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ConfigService } from './app/services/config.service';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),   
    ...appConfig.providers,
     {
      provide: 'APP_CONFIG_LOADER',
      useFactory: (config: ConfigService) => () => config.loadConfig(),
      deps: [ConfigService],
    }
  ]
}).catch(err => console.error(err));

