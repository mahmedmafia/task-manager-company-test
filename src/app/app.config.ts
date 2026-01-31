import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { handlerInterceptor } from './core/interceptors/handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, handlerInterceptor])),
    provideAnimations(),
    DialogService,
    MessageService,
    ConfirmationService,
  ],
};
