import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Location } from './location';
import { Pristine } from './pristine';

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

  findLocation(list: Array<any>, loc_id: string) {
    return list.find(l => l._id === loc_id);
  }

  toggleEdit(loc_id: string) {
    const loc = this.findLocation(this.locations, loc_id);
    loc.editing = !loc.editing;
  }

  discardEdit(loc_id: string) {
    this.toggleEdit(loc_id);
    const pristine = this.findLocation(this.pristineLocations, loc_id);
    const loc = this.findLocation(this.locations, loc_id);
    loc.name = pristine.name;
    loc.address = pristine.address;
    loc.email = pristine.email;
    loc.phone = pristine.phone;
    loc.editing = false;
  }

  updateLocation(loc_id: string) {
    const loc = this.findLocation(this.locations, loc_id);
    const newLoc = {
      _id: loc._id,
      name: loc.name,
      address: loc.address,
      email: loc.email,
      phone: loc.phone
    };
    this._dataService.updateLocation(newLoc).subscribe(res => {

      let message, type;

      if (res['matched'] === 0) {
        message = `${newLoc.name} could not be found in the database, please refresh the page and try again.`;
        type = 'error';
      } else {

        const newPristine = new Pristine(newLoc._id, newLoc.name, newLoc.address, newLoc.email, newLoc.email);
        this.updatePristine(newPristine);
        this.toggleEdit(loc._id);

        if (res['modified'] === 0) {
          message = `None of the details for ${newLoc.name} were changed`;
          type = 'warning';
        } else {
          message = `${newLoc.name} was updated successfully`;
          type = 'success';
        }

      }
      this.messages.push({ 'message': message, 'type': type });
    });
  }

  updatePristine(p: Pristine) {
    let pristine = this.findLocation(this.pristineLocations, p._id);
    pristine = p;
  }

}
