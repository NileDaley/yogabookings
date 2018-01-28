import {User} from 'app/models/user';
import {Skill} from 'app/models/skill';

export class Tutor extends User {

  constructor(forename: string, surname: string, email: string, phone: string, password: string, skills: Skill[]) {
    super(forename, surname, email, phone, password, 10);
    this.skills = skills;
  }

  skills: Array<Skill>;
}
