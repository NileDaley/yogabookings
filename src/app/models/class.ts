import { Tutor } from 'app/models/tutor';
import { Customer } from 'app/models/customer';
import { Venue } from 'app/models/venue';
import { ClassType } from 'app/models/class-type';

export class Class {
  startDate: Date;
  endDate: Date;
  classSize: number;
  price: number;
  tutor: Tutor;
  type: ClassType;
  venue: String;
  attendees: Array<Customer>;
}
