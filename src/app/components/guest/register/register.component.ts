import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Customer } from '../../../models/customer';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  messages = [];
  gender = '';

  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const nameRegex = RegExp(/^[A-z ]+$/);
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      forename: ['', [Validators.required, Validators.pattern(nameRegex)]],
      surname: ['', [Validators.required, Validators.pattern(nameRegex)]],
      gender: ['', [Validators.required]]
    });
  }

  canRegister(): boolean {
    const passwordsMatch =
      this.registerForm.get('password').value ===
      this.registerForm.get('confirmPassword').value;
    return this.registerForm.valid && passwordsMatch;
  }

  register() {
    const {
      forename,
      surname,
      email,
      password,
      gender
    } = this.registerForm.value;
    const newCustomer = new Customer(
      null,
      forename,
      surname,
      '',
      gender,
      new User(null, email, password, 0)
    );
    this._dataService
      .insertCustomer(newCustomer)
      .then(response => {
        if (response['status'] === 201) {
          this._authService
            .login(email, password)
            .then(loginResponse => {
              const data = loginResponse['data'];
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
        } else {
          console.error('An error occurred whilst creating user record');
        }
      })
      .catch(error => console.error(error));
  }
}
