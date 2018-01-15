import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from './location';
import { EditableLocation as Editable } from './editable-location';
import { find, pick } from 'lodash';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: Array<Editable> = [];
  pristineLocations: Array<Location> = [];
  loading = true;
  messages = [];

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getLocations().subscribe(res => {
      const data: Array<any> = res['data'];
      this.pristineLocations = data.map(l =>
        new Location(l._id, l.name, l.address, l.email, l.phone)
      );
      this.locations = this.pristineLocations.map(l =>
        new Editable(l._id, l.name, l.address, l.email, l.phone)
      );
      this.loading = false;
    });
  }

  toggleEdit(loc_id: string): void {
    const loc = find(this.locations, { _id: loc_id });
    loc.editing = !loc.editing;
  }

  discardEdit(loc_id: string): void {

    const pristine: Location = find(this.pristineLocations, { _id: loc_id });
    const loc: Editable = find(this.locations, { _id: loc_id });

    const { name, address, email, phone } = pristine;
    loc.update({ name, address, phone, email });
    loc.editing = false;

  }

  updateLocation(loc_id: string): void {
    const loc: Editable = find(this.locations, { _id: loc_id });
    const newLoc = pick(loc, ['name', 'address', 'email', 'phone']);

    this._dataService.updateLocation(loc_id, newLoc).subscribe(res => {

      let message, type;
      console.log(res);

      if (res['data']['matched'] === 0) {
        message = `${newLoc.name} could not be found in the database, please refresh the page and try again.`;
        type = 'error';
      } else {
        if (res['data']['modified'] === 0) {
          message = `None of the details for ${newLoc.name} were changed`;
          type = 'warning';
        } else {
          const pristine: Location = find(this.pristineLocations, { _id: loc_id });
          pristine.update(newLoc);
          message = `${newLoc.name} was updated successfully`;
          type = 'success';
        }
      }

      loc.editing = false;
      this.messages.push({ 'message': message, 'type': type });

    });
  }

  updatePristine(p: Location): void {
    let pristine = find(this.pristineLocations, { _id: p._id });
    pristine = p;
  }

}
