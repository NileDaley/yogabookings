import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('authorization', `Bearer ${token}`)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
