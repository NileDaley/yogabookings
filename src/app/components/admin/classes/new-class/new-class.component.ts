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
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
  classes = null;
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.getTutors(),
      this.getLocations(),
      this.getClassTypes(),
      this.getAllClasses()
    ])
      .then(() => {
        this.setSelectedDate();
        this.loading = false;
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

  private getAllClasses(): Promise<any> {
    return this._dataService
      .getClasses()
      .toPromise()
      .then(response => {
        this.classes = response['data'].filter(c =>
          moment().isBefore(`${c.date} ${c.startTime}`)
        );
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
    if (this._class.startTime === '') {
      return '';
    } else {
      return this._class.startTime;
    }
  }

  private anyFieldsEmpty(): boolean {
    for (const f in this._class) {
      if (this._class.hasOwnProperty(f)) {
        if (
          this._class[f] === '' ||
          this._class[f] === 0 ||
          this._class[f] === null ||
          this._class[f] === undefined
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private isValidDate(): boolean {
    if (this._class.date === '' || this._class.startTime === '') {
      return false;
    }
    return moment().isBefore(
      moment(`${this._class.date} ${this._class.startTime}`)
    );
  }

  private classesOverlap(a, b): boolean {
    const start = moment(`${a.date} ${a.startTime}`);
    const end = moment(`${a.date} ${a.endTime}`);
    const otherStart = moment(`${b.date} ${b.startTime}`);
    const otherEnd = moment(`${b.date} ${b.endTime}`);
    return (
      start.isBetween(otherStart, otherEnd) ||
      end.isBetween(otherStart, otherEnd) ||
      otherStart.isBetween(start, end) ||
      otherEnd.isBetween(start, end)
    );
  }

  private anyOverlappingClasses(): boolean {
    const overlapMessage = {
      type: 'warning',
      message: `The selected time slot is already occupied at that venue`
    };
    if (
      this._class.date !== '' &&
      this._class.startTime !== '' &&
      this._class.endTime !== ''
    ) {
      let found = false;
      for (const c of this.classes) {
        if (
          this._class.venue === c.venue &&
          this._class.location === c.location._id &&
          this.classesOverlap(this._class, c)
        ) {
          found = true;
          if (
            this.messages.find(m => m.message === overlapMessage.message) ===
            undefined
          ) {
            this.messages.push(overlapMessage);
          }
          break;
        }
      }
      if (!found) {
        const exisingMessage = this.messages.find(
          m => m.message === overlapMessage.message
        );
        if (exisingMessage) {
          this.messages.splice(this.messages.indexOf(exisingMessage), 1);
        }
      }
      return found;
    } else {
      return null;
    }
  }

  private tutorHasAnotherClass(): boolean {
    const otherClasses = this.classes.filter(c => {
      return (
        this._class.tutor === c.tutor._id && this.classesOverlap(this._class, c)
      );
    });

    const message =
      'The selected tutor is already teaching a class at that time';

    const existingMessage = this.messages.find(m => m.message === message);
    if (otherClasses.length > 0) {
      if (!existingMessage) {
        this.messages.push({ message, type: 'warning' });
      }
    } else {
      if (existingMessage) {
        this.messages.splice(this.messages.indexOf(existingMessage), 1);
      }
    }
    return otherClasses.length > 0;
  }

  private isWithinOpenHours(): boolean {
    let validTime = null;
    const classDay = moment(this._class.date).format('dddd');
    const location = this.locations.find(l => l._id === this._class.location);

    if (location && classDay) {
      const invalidTimeMessage = {
        type: 'warning',
        message: `The selected date and time is not within the open hours of ${
          location.name
        }`
      };
      const dayOfWeek = location.openHours.find(
        day => day.day === classDay.toLowerCase()
      );
      if (dayOfWeek.isOpen === false) {
        validTime = false;
      } else {
        const start = moment(`${this._class.date} ${this._class.startTime}`);
        const end = moment(`${this._class.date} ${this._class.endTime}`);
        const open = moment(`${this._class.date} ${dayOfWeek.open}`);
        const close = moment(`${this._class.date} ${dayOfWeek.close}`);
        validTime = start.isBetween(open, close) && end.isBetween(open, close);
      }

      if (validTime === true) {
        this.messages = [];
      } else {
        const existingMessage = this.messages.find(
          m => m.message === invalidTimeMessage.message
        );
        if (!existingMessage) {
          this.messages.push(invalidTimeMessage);
        }
      }

      return validTime;
    } else {
      return null;
    }
  }

  private startIsBeforeEnd(): boolean {
    return moment(`${this._class.date} ${this._class.startTime}`).isBefore(
      `${this._class.date} ${this._class.endTime}`
    );
  }

  private priceIsValid(): boolean {
    const price = this._class.price;
    return price >= 0;
  }

  formIsValid(): boolean {
    const validDate = this.isValidDate();
    const emptyFields = this.anyFieldsEmpty();
    const overlaps = this.anyOverlappingClasses();
    const validTime = this.isWithinOpenHours() && this.startIsBeforeEnd();
    const tutorTeaching = this.tutorHasAnotherClass();
    const validPrice = this.priceIsValid();
    return (
      validDate === true &&
      emptyFields === false &&
      overlaps === false &&
      validTime === true &&
      tutorTeaching === false &&
      validPrice === true
    );
  }

  saveClass() {
    if (this.formIsValid()) {
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
}
