import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private _authService: AuthService, private fb: FormBuilder) {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', Validators.required]
    });
  }

  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this._authService.login(email, password)
      .subscribe(
        response => {
          const data = response['data'];
          const { token, expiresIn } = data;
          const expiresAt = moment().add(expiresIn, 'second').format('YYYY-MM-DD HH:mm:ss');
          localStorage.setItem('token', token);
          localStorage.setItem('expiresAt', expiresAt);
        },
        error => {
          console.log(error);
        }
      );
  }

}
