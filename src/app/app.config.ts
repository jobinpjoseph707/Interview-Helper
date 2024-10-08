import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { apiInterceptorInterceptor } from './core/interceptor/api-interceptor.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptorInterceptor]) // Register the functional interceptor here
    ),
    provideAnimationsAsync(),
    MessageService,
    ConfirmationService,
    DatePipe ,// Include DatePipe if needed in your application
    importProvidersFrom(MatSnackBarModule)
  ]
};
