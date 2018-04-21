import { User } from 'app/models/user';

export class Customer {
  _id: string;
  forename: string;
  surname: string;
  phone: string;
  gender: string;
  user: User;

  constructor(
    id: string,
    forename: string,
    surname: string,
    phone: string,
    gender: string,
    user: User
  ) {
    this._id = id;
    this.forename = forename;
    this.surname = surname;
    this.phone = phone;
    this.gender = gender;
    this.user = user;
  }
}
