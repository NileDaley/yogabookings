import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { Customer } from '../../../models/customer';
import { User } from '../../../models/user';
import { Class } from '../../../models/class';

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

  constructor(
    private _dataService: DataService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this.getCustomer().then(() => {
      this.getClasses();
    });
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

  toggleActiveView(): void {
    this.activeView = this.activeView === 'upcoming' ? 'history' : 'upcoming';
    this.activeView === 'upcoming'
      ? this.filterUpcomingClasses()
      : this.filterPastClasses();
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

  saveChanges(): void {
    this._dataService
      .updateCustomer(this.customer._id, this.customer)
      .then(response => {
        this.isEditingProfile = false;
      })
      .catch(error => console.error(error));
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
