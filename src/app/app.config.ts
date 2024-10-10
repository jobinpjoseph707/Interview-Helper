import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { apiInterceptorInterceptor } from './interceptor/api-interceptor.interceptor';

// Application Configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptorInterceptor]) // Register the interceptor here
    ),

    provideAnimationsAsync(),
    MessageService,
    ConfirmationService,
    DatePipe,
    importProvidersFrom(MatSnackBarModule)
  ]
};
