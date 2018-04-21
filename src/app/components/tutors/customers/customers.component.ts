import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Customer } from 'app/models/customer';
import { User } from 'app/models/user';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  customers: Array<Customer>;
  filteredCustomers: Array<Customer>;
  sortOrder = null;
  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.getCustomers();
  }

  private getCustomers() {
    this._dataService
      .getCustomers()
      .then(response => {
        const customers = response['data'];
        this.filteredCustomers = this.customers = customers.map(c => {
          return new Customer(
            c._id,
            c.forename,
            c.surname,
            c.phone,
            c.gender,
            new User(c.user._id, c.user.email, null, 0)
          );
        });
        this.sortCustomers('surname', 'asc');
      })
      .catch(error => console.log(error));
  }

  filterCustomers(term) {
    if (term === '') {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(c => {
        return (
          c.forename.toLowerCase().includes(term) ||
          c.surname.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.user.email.toLowerCase().includes(term)
        );
      });
    }
  }

  sortCustomers(field, order = null) {
    if (!order) {
      if (this.sortOrder && this.sortOrder.field === field) {
        this.sortOrder.order = this.sortOrder.order === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOrder = { field, order: 'asc' };
      }
    } else {
      this.sortOrder = { field, order };
    }

    this.filteredCustomers = this.filteredCustomers.sort((a, b) => {
      if (this.sortOrder.order === 'asc') {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });
  }
}
