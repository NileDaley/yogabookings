import { assign } from 'lodash';

export class Location {
  _id: string;
  name: string;
  address: string[];
  email: string;
  phone: string;

  constructor(id: string, name: string, address: string[], email: string, phone: string) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

  // Assign each of the fields passed to the object to the location
  update(fields: Object) {
    assign(this, fields);
  }

}
