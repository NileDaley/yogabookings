import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email, password) {
    return this.http.post('/api/auth/login', {email, password});
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

  getToken() {
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(jwtDecode(token)['data']);
    return decoded;
  }

  getIdentity() {

    const token = localStorage.getItem('token');
    const decoded = JSON.parse(jwtDecode(token)['data']);

    return this.http.post('/api/users/identity', decoded);

  }

}
