import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const logGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject<Router>(Router);
  const authService = inject<AuthService>(AuthService);

  return authService.isLoggedIn.pipe(
    map((value: boolean) => {
      return !value || router.createUrlTree(['/user-content']);
    })
  );
};
