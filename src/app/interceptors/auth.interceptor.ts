import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const idToken = localStorage.getItem('id_token');
    if (idToken) {
        const helper = new JwtHelperService();
        if (!helper.isTokenExpired(idToken)) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + idToken)
            });

            return next(cloned);
        } else {
            localStorage.removeItem('id_token');
        }
    }
    return next(req);
}