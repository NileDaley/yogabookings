import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { Customer } from '../../../../models/customer';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  loading = false;
  messages = [];
  id: string;
  customer: Customer;

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.id = this.route.snapshot.paramMap.get('id');
    this.getCustomer(this.id);
  }

  getCustomer(id) {
    this._dataService
      .getCustomer(id)
      .then(res => {
        console.log(res);
        const data = res['data'];
        this.customer = new Customer(
          data._id,
          data.forename,
          data.surname,
          data.phone,
          data.gender,
          new User(
            data.user._id,
            data.user.email,
            data.user.password,
            data.user.role
          )
        );
        this.loading = false;
      })
      .catch(error => console.error(error));
  }
}
