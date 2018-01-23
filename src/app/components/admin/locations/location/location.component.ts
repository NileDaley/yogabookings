import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from 'app/models/location';
import { EditableLocation } from 'app/models/editable-location';
import { pick } from 'lodash';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  pristineLocation: Location;
  location: EditableLocation;
  loading = true;
  editing = false;
  messages = [];

  constructor(private _dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getLocation();
  }

  private getLocation(): void {
    const id: String = this.route.snapshot.paramMap.get('id');
    this._dataService.getLocation(id).subscribe(res => {
      const data = res['data'];
      this.pristineLocation = new Location(
        data._id,
        data.name,
        data.address.map(line => line),
        data.email,
        data.phone,
        data.openHours.map(day => new OpenHours(day.day, day.isOpen, day.open, day.close)),
        data.venues.map(venue => new Venue(venue.name, venue.capacity))
      );
      this.location = new EditableLocation(this.pristineLocation);
      this.location.address = this.location.address.map(line => line);
      this.loading = false;
    }, err => {
      this.messages.push({
        message: 'There was an error retrieving this location from the database',
        type: 'error'
      });
      this.loading = false;
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  discardEdit(): void {
    this.location = new EditableLocation(this.pristineLocation);
    this.toggleEdit();
  }

  updateLocation(): void {

    const newValues = pick(this.location, ['name', 'address', 'email', 'phone', 'openHours']);

    this._dataService.updateLocation(this.location._id, newValues).subscribe(res => {

      let message, type;
      console.log(res);

      if (res['data']['status'] === false) {

        if (res['data']['matched'] === 0) {
          message = `${newValues.name} could not be found in the database, please refresh the page and try again.`;
          type = 'error';
        } else if (res['data']['modified'] === 0) {
          message = `None of the details for ${newValues.name} were changed`;
          type = 'warning';
        }

      } else {
        this.pristineLocation.update(newValues);
        message = `${newValues.name} was updated successfully`;
        type = 'success';
      }

      this.toggleEdit();
      this.messages.push({ 'message': message, 'type': type });

    });
  }

  // Used in the template to resolve bug with editing address lines
  trackByFn(index: any, item: any) {
    return index;
  }

  checkOpenHours(day: OpenHours): void {
    day.isOpen = !(day.open === '' && day.close === '');
  }

  toggleOpen(day: OpenHours) {
    day.isOpen = !day.isOpen;
  }

}
