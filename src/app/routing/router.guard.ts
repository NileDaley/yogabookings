import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class RouterGuard implements CanActivate {
  constructor(public router: Router, public authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(jwtDecode(token)['data']);

    if (!this.authService.isLoggedIn() || decoded.role !== expectedRole) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
