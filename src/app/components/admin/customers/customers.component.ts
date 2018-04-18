import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  customers: Array<any>;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this._dataService
      .getCustomers()
      .then(res => (this.customers = res['data']))
      .catch(error => console.error(error));
  }

  filterCustomers(criteria) {}
}
