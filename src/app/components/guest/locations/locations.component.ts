import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: Array<any>;
  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getLocations().subscribe(res => {
      this.locations = res['data'];
    });
  }

}