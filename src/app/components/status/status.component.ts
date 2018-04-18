import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html'
})
export class StatusComponent implements OnInit {
  users: Array<any>;
  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this._dataService.getCustomers().then(res => {
      this.users = res['data'];
    });
  }
}
