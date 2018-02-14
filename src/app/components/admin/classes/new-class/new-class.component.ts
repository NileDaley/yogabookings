import {Component, OnInit} from '@angular/core';
import {DataService} from 'app/services/data.service';
import {Tutor} from 'app/models/tutor';
import {Location} from 'app/models/location';
import {ClassType} from 'app/models/class-type';
import {User} from '../../../../models/user';
import {Skill} from '../../../../models/skill';
import {OpenHours} from '../../../../models/openHours';
import {Venue} from '../../../../models/venue';
import {Class} from '../../../../models/class';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {

  loading: boolean;

  tutors: Array<Tutor> = null;
  locations: Array<Location> = null;
  classTypes: Array<ClassType> = null;
  _class: Class = new Class(
    null,
    null,
    null,
    [],
    new Date(),
    new Date(),
    0,
    0.00,
    null,
    null
  );

  /*
    TODO: Add locations and show relevant venues
    TODO: Set max class limit to size of currently selected venue
    TODO: Set min date for start date
   */

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
    this.loading = true;
    this.getTutors();
    this.getLocations();
    this.getClassTypes();
  }

  private getTutors() {
    this._dataService.getTutors()
      .subscribe(res => {
        const data = res['data'];
        this.tutors = data.map(t => {
          return new Tutor(
            t._id,
            t.forename,
            t.surname,
            t.gender,
            t.phone,
            new User(t.user.email, null, t.user.role),
            t.skills.map(s => new Skill(s._id, s.name, s.description))
          );
        });
        this.checkLoadingStatus();
      });
  }

  private getLocations() {
    this._dataService.getLocations()
      .subscribe(res => {
        const data = res['data'];
        this.locations = data.map(l => {
          return new Location(
            l._id,
            l.name,
            l.address,
            l.email,
            l.phone,
            l.openHours.map(o => {
              return new OpenHours(o.day, o.isOpen, o.open, o.close);
            }),
            l.venues.map(v => {
              return new Venue(v.name, v.capacity);
            })
          );
        });
        this.checkLoadingStatus();
      });
  }

  private getClassTypes() {
    this._dataService.getClassTypes()
      .subscribe(res => {
        const data = res['data'];
        this.classTypes = data.map(ct => {
          return new ClassType(ct._id, ct.name, ct.description);
        });
        this.checkLoadingStatus();
      });
  }

  private checkLoadingStatus() {
    this.loading = this.tutors === null
      || this.locations === null
      || this.classTypes === null;
  }

  selectValue(field, val) {
    this._class[field] = val;
    console.log(this._class);
  }
}
