import { User } from 'app/models/user';
import { Skill } from 'app/models/skill';

export class Tutor extends User {
  skills: Array<Skill>;
}
