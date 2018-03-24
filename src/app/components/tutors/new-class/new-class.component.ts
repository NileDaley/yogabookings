import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Tutor } from 'app/models/tutor';
import { Location } from 'app/models/location';
import { ClassType } from 'app/models/class-type';
import { User } from 'app/models/user';
import { Skill } from 'app/models/skill';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';
import { Class } from 'app/models/class';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {
  loading = true;
  messages = [];
  tutor: Tutor = null;
  locations: Array<Location> = null;
  venues = [];
  maxClassSize: number;
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

  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([this.getIdentity(), this.getLocations(), this.getClassTypes()])
      .then(() => {
        this.loading = false;
        this.setSelectedDate();
      })
      .catch(err => {
        if (!navigator.onLine) {
          err = 'You seem to be offline, please reconnect and try again';
        }
        this.messages.push({ type: 'error', message: err });
      });
  }

  private setSelectedDate() {
    const params = this.route.snapshot.queryParamMap;
    const start = params.get('start');
    const end = params.get('end');
    if (start && end) {
      this._class.date = start.split(' ')[0];
      this._class.startTime = start.split(' ')[1];
      this._class.endTime = end.split(' ')[1];
    }
  }

  private getIdentity(): Promise<any> {
    return this._authService
      .getIdentity()
      .toPromise()
      .then(response => {
        const identity = response['data'];
        this.tutor = new Tutor(
          identity._id,
          identity.forename,
          identity.surname,
          identity.phone,
          identity.phone,
          new User(identity.user._id, identity.user.email, null, 10),
          identity.skills.map(s => new Skill(s._id, s.name, s.description))
        );
        this._class.tutor = this.tutor._id;
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
        this.classTypes = data.map(
          ct => new ClassType(ct._id, ct.name, ct.description)
        );
      });
  }

  setValue(field: string, val: string): void {
    this._class[field] = val;
    if (field === 'location') {
      this.updateVenues(val);
    }
    if (field === 'venue') {
      this.updateMaxClassSize(val);
    }
  }

  updateVenues(location_id: string): void {
    if (location_id !== '') {
      const location: Location = this.locations.filter(
        l => l._id === location_id
      )[0];
      this.venues = location.venues;
    } else {
      this.venues = [];
    }
  }

  updateMaxClassSize(venue_name: string): void {
    if (venue_name !== '') {
      const location: Location = this.locations.filter(
        l => l._id === this._class.location
      )[0];
      location.venues.forEach((v: Venue) => {
        if (v.name === venue_name) {
          this.maxClassSize = v.capacity;
        }
      });
    } else {
      this.maxClassSize = null;
    }
  }

  earliestClassDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  earliestEndTime(): string {
    return this._class.startTime || '';
  }

  saveClass(): void {
    this._dataService.insertClass(this._class).subscribe(
      res => {
        this.router.navigate(['/tutor']);
      },
      err => {
        this.messages.push({
          type: 'error',
          message:
            'An error occurred whilst booking that class. Please try again'
        });
      }
    );
  }
}
