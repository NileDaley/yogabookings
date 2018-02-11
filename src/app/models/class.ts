import { Tutor } from 'app/models/tutor';
import { Customer } from 'app/models/customer';
import { ClassType } from 'app/models/class-type';
import { Location } from 'app/models/location';

export class Class {
  _id: String;
  type: ClassType;
  tutor: Tutor;
  attendees: Array<Customer>;
  startDate: Date;
  endDate: Date;
  classSize: number;
  price: number;
  location: Location;
  venue: String;

  constructor( id: String,
               type: ClassType,
               tutor: Tutor,
               attendees: Array<Customer>,
               startDate: Date,
               endDate: Date,
               classSize: number,
               price: number,
               location: Location,
               venue: String ) {
    this._id = id;
    this.type = type;
    this.tutor = tutor;
    this.attendees = attendees;
    this.startDate = startDate;
    this.endDate = endDate;
    this.classSize = classSize;
    this.price = price;
    this.location = location;
    this.venue = venue;
  }

}
