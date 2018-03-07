import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password) {
    return this.http.post('/api/auth/login', { email, password });
  }

  private setSession(/* JWT */) {
    // Use moment to set expiry time
    // Add token to localStorage using setItem(key, value)
    // Add expiresAt value to localStorage
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    return localStorage.getItem('expiresAt');
  }


}
