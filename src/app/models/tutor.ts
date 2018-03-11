import { User } from 'app/models/user';
import { Skill } from 'app/models/skill';

export class Tutor {
  _id: string;
  forename: string;
  surname: string;
  gender: string;
  phone: string;
  user: User;
  skills: Array<Skill>;

  constructor(
    id: string,
    forename: string,
    surname: string,
    gender: string,
    phone: string,
    user: User,
    skills: Skill[]
  ) {
    this._id = id;
    this.user = user;
    this.forename = forename;
    this.surname = surname;
    this.gender = gender;
    this.phone = phone;
    this.skills = skills;
  }
}
