import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';





export const handlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.ok) {
        messageService.add({
          severity: 'success',
          summary: 'Success',
        });
      }
    }),
    catchError((err: HttpErrorResponse) => {
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: 100000000000000,
      });
      return throwError(() => err);
    })
  );
};
