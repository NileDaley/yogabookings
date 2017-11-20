export class Location {
  _id: String;
  name: String;
  address: String;
  email: String;
  phone: String;
  editing: Boolean = false;

  constructor(id, name, address, email, phone) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

}
