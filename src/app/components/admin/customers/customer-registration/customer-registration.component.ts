import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../services/data.service';
import {Customer} from '../../../../models/customer';
import {User} from '../../../../models/user';
import {PaymentMethods} from '../../../../models/payment-methods';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.scss']
})
export class CustomerRegistrationComponent implements OnInit {

  customer: Customer;

  constructor(private _dataService: DataService, private router: Router) {
  }

  ngOnInit() {
    this.customer = new Customer('',
      '',
      '',
      '',
      '',
      new User('', '', 0)
    );
  }

  insertCustomer() {
    this._dataService.insertCustomer(this.customer)
      .subscribe(res => {
        console.log(res['data']);
        this.router.navigate(['/admin/customers']);
      },
      err => {
        console.log(err);
      });
  }

  discardEdit() {
    this.router.navigate(['/admin/customers']);
  }

}
