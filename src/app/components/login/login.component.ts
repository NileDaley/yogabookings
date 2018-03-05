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
      email: ['cust@cust.com', [
        Validators.required,
        Validators.email
      ]],
      password: ['customers', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;
    this._authService.login(email, password)
      .subscribe(
        response => {
          const data = response['data'];
          const { token, expiresIn } = data;
          let expiresAt = moment().add(expiresIn, 'second').format('YYYY-MM-DD HH:mm:ss');
          localStorage.setItem("token", token);
          localStorage.setItem("expiresAt", expiresAt);
          console.log(`Is logged in: ${this._authService.isLoggedIn()}`);
          setTimeout(() => {
            console.log(`Is logged in: ${this._authService.isLoggedIn()}`);
          }, 3000);
        },
        error => {
          console.log("ERROR");
          console.log(error);
        }
      );
  }

}
