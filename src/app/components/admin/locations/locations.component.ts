import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from './location';
import { Pristine } from './pristine';
import * as _ from 'lodash';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: Array<Location> = [];
  pristineLocations: Array<Pristine> = [];
  loading = true;
  messages = [];

  constructor(private _dataService: DataService) {}

  ngOnInit() {
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

  toggleEdit(loc_id: string): void {
    const loc = _.find(this.locations, { _id: loc_id });
    loc.editing = !loc.editing;
  }

  discardEdit(loc_id: string): void {

    const pristine: Pristine = _.find(this.pristineLocations, { _id: loc_id });
    const loc: Location = _.find(this.locations, { _id: loc_id });
    loc.name = pristine.name;
    loc.address = pristine.address;
    loc.email = pristine.email;
    loc.phone = pristine.phone;
    this.toggleEdit(loc_id);

  }

  updateLocation(loc_id: string): void {
    const loc = _.find(this.locations, { _id: loc_id });
    const newLoc = _.pick(loc, ['_id', 'name', 'address', 'email', 'phone']);

    this._dataService.updateLocation(newLoc).subscribe(res => {

      let message, type;

      if (res['matched'] === 0) {
        message = `${newLoc.name} could not be found in the database, please refresh the page and try again.`;
        type = 'error';
      } else {
        if (res['modified'] === 0) {
          message = `None of the details for ${newLoc.name} were changed`;
          type = 'warning';
        } else {
          this.updatePristine(new Pristine(newLoc._id, newLoc.name, newLoc.address, newLoc.email, newLoc.email));
          message = `${newLoc.name} was updated successfully`;
          type = 'success';
        }
      }

      this.toggleEdit(loc._id);
      this.messages.push({ 'message': message, 'type': type });

    });
  }

  updatePristine(p: Pristine): void {
    let pristine = _.find(this.pristineLocations, { _id: p._id });
    pristine = p;
  }

}
