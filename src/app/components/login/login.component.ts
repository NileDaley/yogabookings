import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  messages = [];

  constructor(
    private _authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.messages = [];

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this._authService
      .login(email, password)
      .then(response => {
        const data = response['data'];
        const { token, expiresIn } = data;
        const expiresAt = moment()
          .add(expiresIn, 'second')
          .format('YYYY-MM-DD HH:mm:ss');

        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expiresAt);

        const decoded = JSON.parse(jwtDecode(token)['data']);
        const paths = ['customer', 'tutor', 'admin'];
        this.router.navigate([paths[decoded.role / 10]]);
      })
      .catch(error => {
        const message = {
          type: 'error',
          message: 'Invalid username or password, please try again'
        };
        this.messages.push(message);
        const messageIndex = this.messages.indexOf(message);
        setTimeout(() => this.messages.splice(messageIndex, 1), 2000);
      });
  }
}
