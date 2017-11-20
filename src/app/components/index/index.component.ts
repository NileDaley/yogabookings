import { Component } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  users: Array<any>;

  constructor(private _dataService: DataService) {
    this._dataService.getCustomers()
      .subscribe(res => this.users = res['data']);
  }

}
