import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { Customer } from '../../../../models/customer';
import { User } from '../../../../models/user';
import { Class, getInstance } from '../../../../models/class';
import * as moment from 'moment';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  loading = true;
  messages = [];
  id: string;
  customer: Customer;
  customerClasses: Array<Class>;
  activeView = 'details';

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.id = this.route.snapshot.paramMap.get('id');
    Promise.all([this.getCustomer(this.id), this.getCustomerClasses(this.id)])
      .then(() => (this.loading = false))
      .catch(error => console.error(error));
  }

  private getCustomer(id): Promise<any> {
    return this._dataService
      .getCustomer(id)
      .then(res => {
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
      })
      .catch(error => console.error(error));
  }

  private getCustomerClasses(id): Promise<any> {
    return this._dataService
      .getClassesByCustomerID(id)
      .then(response => {
        this.customerClasses = response['data'].map(c => getInstance(c));
      })
      .catch(error => console.error(error));
  }

  currentClasses(): Array<Class> {
    return this.customerClasses.filter(c =>
      moment().isBefore(moment(`${c.date}T${c.startTime}`))
    );
  }

  pastClasses(): Array<Class> {
    return this.customerClasses.filter(c =>
      moment(`${c.date}T${c.endTime}`).isBefore(moment())
    );
  }

  getClassLink(class_id) {
    return `/classes/${class_id}`;
  }

  toggleActiveView(viewName) {
    this.activeView = viewName;
  }
}
