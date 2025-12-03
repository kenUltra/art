import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject<Router>(Router);
  const authService = inject<AuthService>(AuthService);
  const platform: Object = inject(PLATFORM_ID);

  if (isPlatformBrowser(platform)) {
    return authService.isLoggedIn.pipe(
      map((value: boolean) => {
        return value || router.createUrlTree(['/login']) || router.createUrlTree(['/sign-up']);
      })
    );
  }
  return true;
};
