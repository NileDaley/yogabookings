import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from 'app/models/location';
import { find, pick } from 'lodash';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: Array<Location> = [];
  filteredLocations: Array<Location>;
  loading = true;
  messages = [];

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.getLocations();
  }

  private getLocations(): void {
    this._dataService.getLocations().then(res => {
      const data: Array<any> = res['data'];
      this.locations = data.map(
        l =>
          new Location(
            l._id,
            l.name,
            l.address,
            l.email,
            l.phone,
            l.openHours,
            l.venues
          )
      );
      this.filteredLocations = this.locations.map(l => l);
      this.loading = false;
    });
  }

  // filter the locations based on the search criteria
  filterLocations(value: string): void {
    value = value.trim().toLowerCase();
    if (value === '') {
      this.resetFilter();
    }

    /*
      Filters locations based on wether any value of the location matches the search value
    */
    this.filteredLocations = this.locations.filter(location => {
      let match = false;

      const fields = ['name', 'address', 'phone', 'email'];

      fields.forEach(key => {
        // if the current key in location is an array, iterate it's values
        if (key === 'address') {
          for (const line of location[key]) {
            // if the current value matches the search value, returrn true
            if (line.toLowerCase().includes(value)) {
              match = true;
              return;
            }
          }
        } else {
          // if the current value matches the search value, returrn true
          if (location[key].toLowerCase().includes(value)) {
            match = true;
            return;
          }
        }
      });

      return match;
    });
  }

  resetFilter(): void {
    this.filteredLocations = this.locations.map(l => l);
  }
}
