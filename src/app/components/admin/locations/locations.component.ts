import { Component } from '@angular/core';
import { DataService } from 'app/services/data.service'

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {

  locations: Array<any>;
  loading: Boolean = true;

  constructor(private _dataService: DataService) {
    this._dataService.getLocations().subscribe( (res) => {
      this.locations = res
      for (const l of this.locations){
          l.editing = false
      }
      this.loading = false
    })
  }

  prettifyAddress(address: String): Array<String> {
    return address.split(',')
  }

  getLocation(loc_id: String) {
    return this.locations.find(l => l._id === loc_id)
  }

  toggleEdit(loc_id: String) {
    const loc = this.getLocation(loc_id)
    loc.editing = ! loc.editing
  }

  discardEdit(loc_id: any) {
    this.toggleEdit(loc_id)
  }

}
