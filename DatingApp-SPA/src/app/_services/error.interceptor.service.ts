import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpEvent, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    return handler.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {

          if (error.status == 401) {
            return throwError(error.statusText);
          }

          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }

          const serverError = error.error;
          let modelStateErros = '';
          if (serverError && typeof serverError === 'object') {
            for (const key in serverError) {
              if (serverError[key]) {
                modelStateErros += serverError[key] + '\n';
              }
            }
          }

          return throwError(modelStateErros || serverError || 'Server error');
        }
      }));
  }
}



