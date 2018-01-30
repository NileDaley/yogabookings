import {User} from './user';

export class Admin {

  _id: string;
  forename: string;
  surname: string;
  isOwner = false;
  user: User;

  constructor(id: string, forename: string, surname: string, isOwner: boolean, user: User) {
    this._id = id;
    this.forename = forename;
    this.surname = surname;
    this.isOwner = isOwner;
    this.user = user;
  }

}
