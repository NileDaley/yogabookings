import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { Customer } from '../../../models/customer';
import { User } from '../../../models/user';
import { Class } from '../../../models/class';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  loading = true;
  isEditingProfile = false;
  customer: Customer;
  activeView = 'upcoming';
  allClasses = [];
  filteredClasses = [];
  messages = [];
  detailsForm: FormGroup;
  changePassword = false;

  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadComponentData();
  }

  loadComponentData(): Promise<any> {
    this.loading = true;
    return this.getCustomer().then(() => {
      this.createForm();
      this.getClasses();
    });
  }

  createForm() {
    const nameRegex = RegExp(/^[A-z ]+$/);
    this.detailsForm = this.fb.group({
      email: [
        this.customer.user.email,
        [Validators.required, Validators.email]
      ],
      phone: this.customer.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      forename: [
        this.customer.forename,
        [Validators.required, Validators.pattern(nameRegex)]
      ],
      surname: [
        this.customer.surname,
        [Validators.required, Validators.pattern(nameRegex)]
      ],
      gender: [this.customer.gender, [Validators.required]]
    });
    this.addFormGetters();
  }

  addFormGetters(): void {
    Object.keys(this.detailsForm.value).forEach(
      key => (this[key] = this.detailsForm.get(key))
    );
  }

  getCustomer(): Promise<any> {
    return this._authService
      .getIdentity()
      .then(response => {
        const data = response['data'];
        this.customer = new Customer(
          data._id,
          data.forename,
          data.surname,
          data.phone,
          data.gender,
          new User(data.user._id, data.user.email, data.user.password, 0)
        );
      })
      .catch(error => console.error(error));
  }

  getClasses(): void {
    this._dataService
      .getClasses()
      .then(response => {
        const classes = response['data'];
        this.allClasses = classes.filter(c =>
          c.attendees.map(a => a._id).includes(this.customer._id)
        );
        this.filterUpcomingClasses();
        this.loading = false;
      })
      .catch(error => console.error(error));
  }

  toggleActiveView(view): void {
    this.activeView = view;
    switch (view) {
      case 'upcoming':
        this.filterUpcomingClasses();
        break;
      case 'history':
        this.filterPastClasses();
        break;
    }
  }

  toggleNewPassword(value) {
    this.changePassword = value;
  }

  filterUpcomingClasses(): void {
    this.filteredClasses = this.allClasses.filter(c => {
      return moment(`${c.date} ${c.startTime}`).isAfter(moment());
    });
  }

  filterPastClasses(): void {
    this.filteredClasses = this.allClasses.filter(c => {
      return moment().isAfter(moment(`${c.date} ${c.endTime}`));
    });
  }

  discardEdit(): void {
    this.getCustomer();
    this.isEditingProfile = false;
  }

  formIsValid(): boolean {
    if (this.changePassword) {
      const {
        currentPassword,
        newPassword,
        confirmNewPassword
      } = this.detailsForm.value;
      return (
        this.detailsForm.status.toLowerCase() === 'valid' &&
        this.passwordsAreValid(currentPassword, newPassword, confirmNewPassword)
      );
    } else {
      return this.detailsForm.status.toLowerCase() === 'valid';
    }
  }

  passwordsAreValid(current: string, _new: string, confirm: string): boolean {
    const anyEmptyPasswords = [current, _new, confirm]
      .map(val => val.length)
      .includes(0);
    return !anyEmptyPasswords && _new === confirm;
  }

  saveChanges(): void {
    if (this.formIsValid()) {
      const forename = this['forename'].value;
      const surname = this['surname'].value;
      const phone = this['phone'].value;
      const gender = this['gender'].value;
      const user = {
        _id: this.customer.user._id,
        email: this['email'].value,
        password: this.customer.user.password,
        role: 0
      };
      const payload = {
        _id: this.customer._id,
        forename,
        surname,
        phone,
        gender,
        user,
        passwordGuess: this.changePassword
          ? this['currentPassword'].value
          : null,
        newPassword: this.changePassword ? this['newPassword'].value : null
      };
      this._dataService
        .updateCustomer(this.customer._id, payload)
        .then(response => {
          console.log(response);
          this.isEditingProfile = false;
          this.loadComponentData().then(() => {
            this.messages.push({
              type: 'success',
              message: 'Details successfully updated'
            });
          });
        })
        .catch(error => console.error(error));
    } else {
      scrollTo({ top: 0, behavior: 'smooth' });
      this.messages.push({
        type: 'warning',
        message: 'Please fix all form errors and try again'
      });
    }
  }

  cancelBookings(bookings): void {
    const payload = {
      customer: this.customer,
      classes: bookings
    };
    console.log(payload);
    this._dataService
      .cancelBookings(payload)
      .then(response => {
        this.getClasses();
        const message = {
          message: 'Class successfully deleted',
          type: 'success'
        };
        this.messages.push(message);
        setTimeout(() => {
          this.messages.splice(this.messages.indexOf(message), 1);
        }, 2000);
      })
      .catch(error => {
        const message = {
          message: 'An error occured whilst trying to delete a class',
          type: 'error'
        };
        this.messages.push(message);
      });
  }
}
