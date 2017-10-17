import { Component } from '@angular/core';
import { DataService } from 'app/services/data.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent{

  customers: Array<any>;
  constructor(private _dataService: DataService) {
    this._dataService.getCustomers().subscribe(res => this.customers = res)
  }
}
