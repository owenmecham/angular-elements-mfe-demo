import { AdesaAuthorizationService } from '@adesa/authorization';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private readonly adesaAuthService: AdesaAuthorizationService) {}

  async canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!(await this.adesaAuthService.isAuthenticated())) {
      this.adesaAuthService.setDesiredUrl(state.url);
      this.adesaAuthService.login();
      return false;
    }
    return true;
  }
}
