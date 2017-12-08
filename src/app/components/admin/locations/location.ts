export class Location {
  _id: string;
  name: string;
  address: Array<string>;
  email: string;
  phone: string;
  editing: Boolean = false;

  constructor(id: string, name: string, address: Array<string>, email: string, phone: string) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

}
