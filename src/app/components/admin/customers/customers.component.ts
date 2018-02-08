import {Component, OnInit} from '@angular/core';
import {DataService} from 'app/services/data.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: Array<any>;

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
    this._dataService.getCustomers().subscribe(res => this.customers = res['data']);
  }

  filterCustomers(criteria) {

  }

}
