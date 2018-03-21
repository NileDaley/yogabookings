import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Tutor } from 'app/models/tutor';
import { Location } from 'app/models/location';
import { ClassType } from 'app/models/class-type';
import { User } from '../../../../models/user';
import { Skill } from '../../../../models/skill';
import { OpenHours } from '../../../../models/openHours';
import { Venue } from '../../../../models/venue';
import { Class } from '../../../../models/class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {
  loading: boolean;
  messages = [];
  tutors: Array<Tutor> = null;
  locations: Array<Location> = null;
  venues = [];
  maxClassSize;
  classTypes: Array<ClassType> = null;
  _class = {
    classType: '',
    tutor: '',
    location: '',
    venue: '',
    classSize: '',
    price: 0.0,
    date: '',
    startTime: '',
    endTime: '',
    repeating: false,
    repeatInterval: 'week',
    repeatCount: 2
  };

  constructor(private _dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([this.getTutors(), this.getLocations(), this.getClassTypes()])
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        if (!navigator.onLine) {
          err = 'You seem to be offline, please reconnect and try again';
        }
        this.messages.push({ type: 'error', message: err });
      });
  }

  private getTutors(): Promise<any> {
    return this._dataService
      .getTutors()
      .toPromise()
      .then(res => {
        const data = res['data'];
        this.tutors = data.map(t => {
          return new Tutor(
            t._id,
            t.forename,
            t.surname,
            t.gender,
            t.phone,
            new User(t.user._id, t.user.email, null, t.user.role),
            t.skills.map(s => new Skill(s._id, s.name, s.description))
          );
        });
      });
  }

  private getLocations(): Promise<any> {
    return this._dataService
      .getLocations()
      .toPromise()
      .then(res => {
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
      });
  }

  private getClassTypes(): Promise<any> {
    return this._dataService
      .getClassTypes()
      .toPromise()
      .then(res => {
        const data = res['data'];
        this.classTypes = data.map(ct => {
          return new ClassType(ct._id, ct.name, ct.description);
        });
      });
  }

  setValue(field: string, val: string) {
    this._class[field] = val;
    if (field === 'location') {
      this.updateVenues(val);
    }
    if (field === 'venue') {
      this.updateMaxClassSize(val);
    }
  }

  updateVenues(location_id: string) {
    if (location_id !== '') {
      const location: Location = this.locations.filter(
        l => l._id === location_id
      )[0];
      this.venues = location.venues;
    } else {
      this.venues = [];
    }
  }

  updateMaxClassSize(venue_name: string) {
    if (venue_name !== '') {
      const location: Location = this.locations.filter(
        l => l._id === this._class.location
      )[0];
      console.log(location);
      location.venues.forEach((v: Venue) => {
        if (v.name === venue_name) {
          this.maxClassSize = v.capacity;
        }
      });
    } else {
      this.maxClassSize = '';
    }
  }

  earliestClassDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    const day =
      date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    return `${year}-${month}-${day}`;
  }

  earliestEndTime(): string {
    return this._class.startTime || '';
  }

  saveClass() {
    this._dataService.insertClass(this._class).subscribe(
      res => {
        this.router.navigate(['/admin/classes']);
      },
      err => {
        console.log(err);
      }
    );
  }
}
