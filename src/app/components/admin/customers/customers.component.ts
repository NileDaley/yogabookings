import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  loading = true;
  customers: Array<any>;
  filteredCustomers: Array<any>;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this._dataService
      .getCustomers()
      .then(res => {
        this.filteredCustomers = this.customers = res['data'];
        this.loading = false;
      })
      .catch(error => console.error(error));
  }

  filterCustomers(criteria) {
    criteria = criteria.trim().toLowerCase();
    if (criteria === '') {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(c => {
        return [c.forename, c.surname, c.phone, c.user.email]
          .map(el => el.toLowerCase().includes(criteria))
          .includes(true);
      });
    }
  }
}
