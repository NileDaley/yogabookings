import { Tutor } from 'app/models/tutor';
import { Customer } from 'app/models/customer';
import { ClassType } from 'app/models/class-type';
import { Location } from 'app/models/location';
import { ClassGroup } from 'app/models/class-group';

export class Class {
  _id: String;
  type: ClassType;
  tutor: Tutor;
  attendees: Array<Customer>;
  date: string;
  startTime: string;
  endTime: string;
  classSize: number;
  price: string;
  location: Location;
  venue: string;
  classGroup: ClassGroup;

  constructor(
    id: string,
    type: ClassType,
    tutor: Tutor,
    attendees: Array<Customer>,
    date: string,
    startTime: string,
    endTime: string,
    classSize: number,
    price: string,
    location: Location,
    venue: string,
    classGroup?: ClassGroup
  ) {
    this._id = id;
    this.type = type;
    this.tutor = tutor;
    this.attendees = attendees;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.classSize = classSize;
    this.price = price;
    this.location = location;
    this.venue = venue;
    this.classGroup = classGroup;
  }
}
