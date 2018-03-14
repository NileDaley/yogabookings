import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import * as moment from 'moment';
import { Class } from 'app/models/class';
import { ClassType } from 'app/models/class-type';
import { Tutor } from 'app/models/tutor';
import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';
import { Skill } from 'app/models/skill';
import { Location } from 'app/models/location';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';
import { ClassGroup } from 'app/models/class-group';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  loading = true;
  messages = [];
  modalActive = false;
  bookingView = 'single';

  isLoggedIn: boolean = null;
  customer: Customer = null;
  role = null;

  locations: Array<Location>;
  classTypes: Array<ClassType>;
  filteredClasses: Array<Class>;
  classes: Array<Class>;
  tutors: Array<Tutor>;

  selectedClassType = '';
  selectedLocation = '';
  selectedTutor = '';
  selectedClass = null;
  repeatBookings = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getClasses().then(() => {
      this.authService.isLoggedIn().subscribe(
        value => {
          this.isLoggedIn = value;
          if (value === true) {
            this.role = this.authService.getToken()['role'];
            if (this.role === 0 && this.customer === null) {
              this.setCustomer();
            }
          } else {
            this.role = null;
            this.customer = null;
          }
        },
        error => console.log(error)
      );
      this.setClassTypes();
      this.setLocations();
      this.setTutors();
    });
  }

  private getClasses() {
    return this.dataService
      .getClasses()
      .toPromise()
      .then(response => {
        const classes = response['data'];
        this.filteredClasses = this.classes = classes
          .filter(c => {
            return (
              moment(`${c.date} ${c.startTime}`).isAfter(moment()) &&
              c.attendees.length < c.classSize
            );
          })
          .sort((a, b) => {
            // Sort classes in chronological order
            return moment(`${b.date} ${b.startTime}`).isBefore(
              moment(`${a.date} ${a.startTime}`)
            );
          })
          .map(c => {
            // Map classes to Class objects
            return new Class(
              c._id,
              new ClassType(
                c.classType._id,
                c.classType.name,
                c.classType.description
              ),
              new Tutor(
                c.tutor._id,
                c.tutor.forename,
                c.tutor.surname,
                c.tutor.gender,
                c.tutor.phone,
                new User(c.tutor.user.email, null, c.tutor.user.role),
                c.tutor.skills.map(s => new Skill(s._id, s.name, s.description))
              ),
              c.attendees.map(
                a =>
                  new Customer(
                    a._id,
                    a.forename,
                    a.surname,
                    a.phone,
                    a.gender,
                    new User(a.user.email, null, a.role)
                  )
              ),
              c.date,
              c.startTime,
              c.endTime,
              c.classSize,
              c.price,
              new Location(
                c.location._id,
                c.location.name,
                c.location.address,
                c.location.email,
                c.location.phone,
                c.location.openHours.map(
                  day => new OpenHours(day.day, day.isOpen, day.open, day.close)
                ),
                c.location.venues.map(v => new Venue(v.name, v.capacity))
              ),
              c.venue,
              c.hasOwnProperty('classGroup')
                ? new ClassGroup(
                    c.classGroup._id,
                    c.classGroup.startDate,
                    c.classGroup.interval,
                    c.classGroup.count
                  )
                : null
            );
          });
        this.loading = false;
      })
      .catch(err => console.log(err));
  }

  private setClassTypes() {
    this.classTypes = this.getUniques(this.classes, 'type', 'id');
  }

  private setLocations() {
    this.locations = this.getUniques(this.classes, 'location', '_id');
  }

  private setTutors() {
    this.tutors = this.getUniques(this.classes, 'tutor', '_id');
  }

  private setCustomer() {
    this.authService.getIdentity().subscribe(
      response => {
        const cust = response['data'];
        this.customer = new Customer(
          cust._id,
          cust.forename,
          cust.surname,
          cust.phone,
          cust.gender,
          new User(cust.user.email, null, 0)
        );
        this.classes = this.filteredClasses = this.filteredClasses.filter(c => {
          return !c.attendees.map(a => a._id).includes(this.customer._id);
        });
      },
      error => console.log(error)
    );
  }

  private getUniques(source, element, identifier) {
    const uniques = [];
    for (const item of source) {
      const el = item[element];
      let found = false;
      for (const unique of uniques) {
        if (unique[identifier] === el[identifier]) {
          found = true;
        }
      }
      if (!found) {
        uniques.push(el);
      }
    }
    return uniques;
  }

  /**
   * Filters classes based on criteria
   * @param category 'classType' || 'tutor' || 'location'
   * @param value Option selected
   */
  filterClasses(category, value) {
    this[category] = value;
    this.filteredClasses = this.classes.filter(c => {
      // Uses .includes() so that an empty filter will still match
      return (
        c.location._id.includes(this.selectedLocation) &&
        c.type.id.includes(this.selectedClassType) &&
        c.tutor._id.includes(this.selectedTutor)
      );
    });
  }

  resetFilters() {
    ['Location', 'Tutor', 'ClassType'].forEach(i =>
      this.filterClasses(`selected${i}`, '')
    );
  }

  showBookingModal(c) {
    this.selectedClass = c;
    this.modalActive = true;
  }

  closeModal() {
    this.modalActive = false;
    this.repeatBookings = [];
    this.selectedClass = null;
  }

  toggleBookingView(view) {
    this.bookingView = view;
  }

  toggleRepeatBooking(_class) {
    if (this.repeatBookings.indexOf(_class._id) !== -1) {
      const index = this.repeatBookings.indexOf(_class._id);
      this.repeatBookings.splice(index, 1);
    } else {
      this.repeatBookings.push(_class._id);
    }
  }

  getClassesByGroup(classGroup) {
    return this.classes.filter(c => c.classGroup._id === classGroup._id);
  }

  removeRepeatBookings() {
    this.repeatBookings = [];
  }

  addAllRepeatBookings() {
    this.repeatBookings = [];
    this.repeatBookings = this.getClassesByGroup(
      this.selectedClass.classGroup
    ).map(c => c._id);
  }

  // Transform the list of class id's to existing class objects
  getRepeatClasses() {
    return this.repeatBookings.map(r => {
      return this.classes.find(c => c._id === r);
    });
  }

  bookClasses(classes) {
    this.dataService
      .insertBookings({
        classes,
        customer: this.customer
      })
      .subscribe(
        response => {
          const data = response['data'];
          if (data[0]['nModified'] > 0) {
            this.messages.push({
              message: 'Congratulations, your booking has been confirmed!',
              type: 'success'
            });
            this.modalActive = false;
            this.selectedClass = null;
            this.repeatBookings = [];
          } else {
            this.messages.push({
              message:
                'A problem occurred whilst making your booking, please try again.',
              type: 'error'
            });
          }
        },
        error => {
          this.messages.push({
            message:
              'A problem occurred whilst making your booking, please try again.',
            type: 'error'
          });
        }
      );
  }
}
