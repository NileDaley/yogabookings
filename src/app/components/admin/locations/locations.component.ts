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
  loading: Boolean = true;
  messages = [];

  constructor(private _dataService: DataService) {
    this._dataService.getLocations().subscribe(res => {
      const data: Array<any> = res['data'];
      data.forEach(el => {
        const pristine = new Pristine(el._id, el.name, el.address, el.email, el.phone);
        const location = new Location(el._id, el.name, el.address, el.email, el.phone);
        this.pristineLocations.push(pristine);
        this.locations.push(location);
      });
      this.loading = false;
    });
  }

  prettifyAddress(address: String): Array<String> {
    return address.split(',');
  }

  getLocation(loc_id: String) {
    return this.locations.find(l => l._id === loc_id);
  }

  toggleEdit(loc_id: String) {
    const loc = this.getLocation(loc_id);
    loc.editing = !loc.editing;
  }

  discardEdit(loc_id) {
    this.toggleEdit(loc_id);
    const pristine = this.pristineLocations.find(el => el._id === loc_id);
    const loc = this.getLocation(loc_id);
    loc.address = pristine.address;
    loc.email = pristine.email;
    loc.phone = pristine.phone;
    loc.editing = false;
  }

  updateLocation(loc_id) {
    const loc = this.getLocation(loc_id);
    const newLoc = {
      _id: loc._id,
      name: loc.name,
      address: loc.address,
      email: loc.email,
      phone: loc.phone
    };
    this._dataService.updateLocation(newLoc).subscribe(res => {

      if (res['matched'] > 0) {

        const pristine = this.pristineLocations.find(l => l._id === newLoc._id);
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
            'message': `${newLoc.name} was not changed`,
            'type': 'success'
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
