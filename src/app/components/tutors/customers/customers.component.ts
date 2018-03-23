import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Customer } from 'app/models/customer';
import { User } from 'app/models/user';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Array<Customer>;
  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.getCustomers();
  }

  private getCustomers() {
    this._dataService
      .getCustomers()
      .toPromise()
      .then(response => {
        const customers = response['data'];
        this.customers = customers.map(c => {
          return new Customer(
            c._id,
            c.forename,
            c.surname,
            c.phone,
            c.gender,
            new User(c.user._id, c.user.email, null, 0)
          );
        });
        console.log(this.customers);
      })
      .catch(error => console.log(error));
  }
}
