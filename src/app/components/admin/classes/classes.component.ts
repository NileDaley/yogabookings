import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Class } from 'app/models/class';
import { ClassType } from 'app/models/class-type';
import { Tutor } from 'app/models/tutor';
import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';
import { Skill } from 'app/models/skill';
import { Location } from 'app/models/location';
import { OpenHours } from '../../../models/openHours';
import { Venue } from '../../../models/venue';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: [ './classes.component.scss' ]
})
export class ClassesComponent implements OnInit {

  loading = true;
  messages = [];
  classes: Array<Class>;

  constructor( private _dataService: DataService ) {
  }

  ngOnInit() {
    this._dataService.getClasses()
      .subscribe(res => {
        const data = res[ 'data' ];
        console.log(data);
        this.classes = data.map(c => {
          return new Class(
            new ClassType(c.classType._id, c.classType.name, c.classType.description),
            new Tutor(
              c.tutor._id,
              c.tutor.forename,
              c.tutor.surname,
              c.tutor.gender,
              c.tutor.phone,
              new User(c.tutor.user.email, null, c.tutor.user.role),
              c.tutor.skills.map(s => new Skill(s._id, s.name, s.description))
            ),
            c.attendees.map(a => new Customer(
              a._id,
              a.forename,
              a.surname,
              a.phone,
              a.gender,
              new User(a.user.email, null, a.role)
            )),
            c.startDate,
            c.endDate,
            c.classSize,
            c.price,
            new Location(
              c.location._id,
              c.location.name,
              c.location.address,
              c.location.email,
              c.location.phone,
              c.location.openHours.map(day => new OpenHours(day.day, day.isOpen, day.open, day.close)),
              c.location.venues.map(v => new Venue(v.name, v.capacity))
            ),
            c.venue
          );
        });
      }, err => {
        console.log(err);
      });
  }

}
