import { assign } from 'lodash';
import { OpenHours } from './openHours';
import { Venue } from './venue';

export class Location {
  _id: string;
  name: string;
  address: string[];
  email: string;
  phone: string;
  openHours: Array<OpenHours>;
  venues: Array<Venue>;

  constructor(
    id: string,
    name: string,
    address: string[],
    email: string,
    phone: string,
    openHours: Array<OpenHours>,
    venues: Array<Venue>
  ) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.openHours = openHours;
    this.venues = venues;
  }

  // Assign each of the fields passed to the object to the location
  update(fields: Object) {
    assign(this, fields);
  }
}
