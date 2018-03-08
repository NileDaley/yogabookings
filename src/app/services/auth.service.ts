import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email, password) {
    return this.http.post('/api/auth/login', {email, password});
  }

  private setSession(/* JWT */) {
    // Use moment to set expiry time
    // Add token to localStorage using setItem(key, value)
    // Add expiresAt value to localStorage
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    this.router.navigate(['/']);
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {

      setInterval(() => {
        const value = this.getExpiration() !== null && moment().isBefore(this.getExpiration());
        observer.next(value);
      }, 1000);

    });
  }

  getExpiration() {
    return localStorage.getItem('expiresAt');
  }


}
