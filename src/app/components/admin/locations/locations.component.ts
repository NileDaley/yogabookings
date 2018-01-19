import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from 'app/models/location';
import { EditableLocation as Editable } from 'app/models/editable-location';
import { find, pick } from 'lodash';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: Array<Location> = [];
  loading = true;
  messages = [];

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getLocations().subscribe(res => {
      const data: Array<any> = res['data'];
      this.locations = data.map(l =>
        new Location(l._id, l.name, l.address, l.email, l.phone)
      );
      this.loading = false;
    });
  }

}
