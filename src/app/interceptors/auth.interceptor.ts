import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem('id_token');
    if (idToken) {
      const helper = new JwtHelperService();
      if (!helper.isTokenExpired(idToken)) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + idToken)
        });

        return next.handle(cloned);
      } else {
        localStorage.removeItem('id_token');
      }
    }
    return next.handle(req);
  }
}
