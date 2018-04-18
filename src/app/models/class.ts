import { ClassType } from 'app/models/class-type';
import { Tutor } from 'app/models/tutor';
import { User } from 'app/models/user';
import { Skill } from 'app/models/skill';
import { Customer } from 'app/models/customer';
import { Location } from 'app/models/location';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';
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

export function getInstance(data): Class {
  return new Class(
    data._id,
    new ClassType(
      data.classType._id,
      data.classType.name,
      data.classType.description
    ),
    new Tutor(
      data.tutor._id,
      data.tutor.forename,
      data.tutor.surname,
      data.tutor.gender,
      data.tutor.phone,
      new User(
        data.tutor.user._id,
        data.tutor.user.email,
        null,
        data.tutor.user.role
      ),
      data.tutor.skills.map(s => new Skill(s._id, s.name, s.description))
    ),
    data.attendees.map(
      a =>
        new Customer(
          a._id,
          a.forename,
          a.surname,
          a.phone,
          a.gender,
          new User(a.user._id, a.user.email, null, a.role)
        )
    ),
    data.date,
    data.startTime,
    data.endTime,
    data.classSize,
    data.price,
    new Location(
      data.location._id,
      data.location.name,
      data.location.address,
      data.location.email,
      data.location.phone,
      data.location.openHours.map(
        day => new OpenHours(day.day, day.isOpen, day.open, day.close)
      ),
      data.location.venues.map(v => new Venue(v.name, v.capacity))
    ),
    data.venue,
    data.hasOwnProperty('classGroup')
      ? new ClassGroup(
          data.classGroup._id,
          data.classGroup.startDate,
          data.classGroup.interval,
          data.classGroup.count
        )
      : null
  );
}
