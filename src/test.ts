// This is your entry point for tests
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TasksService } from './app/core/services/tasks.service';
import { UsersService } from './app/core/services/users.service';
import { StatisticsService } from './app/pages/dashboard/statistics/statistics.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
export function configureGlobalTestingModule(extra?: {
  imports?: any[],
  providers?: any[]
}) {
  return getTestBed().configureTestingModule({
    providers:[
      provideRouter([]),
      provideHttpClient(),
      provideAnimations(),
      provideHttpClientTesting(),
      DialogService,
      MessageService,
      TasksService,
      UsersService,
      StatisticsService,
      ConfirmationService,
      ...(extra?.providers ?? [])
    ],
    imports:[
      ...(extra?.imports ??[])
    ],
  });
}
// // Automatically load all .spec.ts files
// const context = (require as any).context('./', true, /\.spec\.ts$/);
// context.keys().map(context);
