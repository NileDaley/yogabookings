import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Customer } from '../../../../models/customer';
import { User } from '../../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html'
})
export class CustomerRegistrationComponent implements OnInit {
  customer: Customer;

  constructor(private _dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.customer = new Customer('', '', '', '', '', new User(null, '', '', 0));
  }

  insertCustomer() {
    this._dataService
      .insertCustomer(this.customer)
      .then(res => {
        console.log(res['data']);
        this.router.navigate(['/admin/customers']);
      })
      .catch(error => console.error(error));
  }

  discardEdit() {
    this.router.navigate(['/admin/customers']);
  }
}
