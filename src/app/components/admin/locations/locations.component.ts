import { Component } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from './location';
import { Pristine } from './pristine';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {

  locations: Array<Location> = [];
  pristineLocations: Array<Pristine> = [];
  loading = true;
  messages = [];

  constructor(private _dataService: DataService) {
    this._dataService.getLocations().subscribe(res => {
      const data: Array<any> = res['data'];
      this.pristineLocations = data.map(p =>
        new Pristine(p._id, p.name, p.address, p.email, p.phone)
      );
      this.locations = this.pristineLocations.map(l =>
        new Location(l._id, l.name, l.address, l.email, l.phone)
      );
      this.loading = false;
    });
  }

  getLocation(list: Array<any>, loc_id: string) {
    return list.find(l => l._id === loc_id);
  }

  toggleEdit(loc_id: string) {
    const loc = this.getLocation(this.locations, loc_id);
    loc.editing = !loc.editing;
  }

  discardEdit(loc_id: string) {
    this.toggleEdit(loc_id);
    const pristine = this.getLocation(this.pristineLocations, loc_id);
    const loc = this.getLocation(this.locations, loc_id);
    loc.address = pristine.address;
    loc.email = pristine.email;
    loc.phone = pristine.phone;
    loc.editing = false;
  }

  updateLocation(loc_id: string) {
    const loc = this.getLocation(this.locations, loc_id);
    const newLoc = {
      _id: loc._id,
      name: loc.name,
      address: loc.address,
      email: loc.email,
      phone: loc.phone
    };
    this._dataService.updateLocation(newLoc).subscribe(res => {

      if (res['matched'] > 0) {

        const pristine = this.getLocation(this.pristineLocations, newLoc._id);
        pristine.address = newLoc.address;
        pristine.email = newLoc.email;
        pristine.phone = newLoc.phone;
        loc.editing = false;

        if (res['modified'] > 0) {
          this.messages.push({
            'message': `${newLoc.name} was updated successfully`,
            'type': 'success'
          });
        } else {
          this.messages.push({
            'message': `None of the details for ${newLoc.name} were changed`,
            'type': 'warning'
          });
        }

      } else {
        this.messages.push({
          'message': `${newLoc.name} could not be found in the database, please refresh the page and try again.`,
          'type': 'error'
        });
      }

    });
  }

}
