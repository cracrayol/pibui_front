import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const loggedInGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return (authService.isLoggedIn() && authService.getUser().isAdmin) || router.parseUrl('/');
  };