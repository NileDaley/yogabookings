export class Pristine {
  _id: string;
  name: string;
  address: Array<string>;
  email: string;
  phone: string;

  constructor(id: string, name: string, address: Array<string>, email: string, phone: string) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

}
