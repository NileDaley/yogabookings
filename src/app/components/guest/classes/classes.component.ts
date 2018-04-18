import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import * as moment from 'moment';
import { Class, getInstance } from 'app/models/class';
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
  minimumDate = moment().format('YYYY-MM-DD');

  isLoggedIn: boolean = null;
  customer: Customer = null;
  role = null;

  locations: Array<Location>;
  classTypes: Array<ClassType>;
  filteredClasses: Array<Class>;
  classes: Array<Class>;
  tutors: Array<Tutor>;

  selectedDate = '';
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
      this.authService.watchLoginStatus().subscribe(
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

  private getClasses(): Promise<any> {
    return this.dataService
      .getClasses()
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
            return getInstance(c);
          });
        this.loading = false;
      })
      .catch(err => console.log(err));
  }

  private setClassTypes(): void {
    this.classTypes = this.getUniques(this.classes, 'type', 'id');
  }

  private setLocations(): void {
    this.locations = this.getUniques(this.classes, 'location', '_id');
  }

  private setTutors(): void {
    this.tutors = this.getUniques(this.classes, 'tutor', '_id');
  }

  private setCustomer(): void {
    this.authService
      .getIdentity()
      .then(response => {
        const cust = response['data'];
        this.customer = new Customer(
          cust._id,
          cust.forename,
          cust.surname,
          cust.phone,
          cust.gender,
          new User(cust.user._id, cust.user.email, null, 0)
        );
        this.classes = this.filteredClasses = this.filteredClasses.filter(c => {
          return !c.attendees.map(a => a._id).includes(this.customer._id);
        });
      })
      .catch(error => console.error(error));
  }

  private getUniques(source, element, identifier): Array<any> {
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
  filterClasses(category, value): void {
    this[category] = value;

    this.filteredClasses = this.classes
      .filter(c => {
        return (
          (this.selectedDate !== '' ? c.date === this.selectedDate : true) &&
          (this.customer
            ? c.attendees.map(a => a._id === this.customer._id)
            : true) &&
          c.location._id.includes(this.selectedLocation) &&
          c.type.id.includes(this.selectedClassType) &&
          c.tutor._id.includes(this.selectedTutor) &&
          moment().isBefore(moment(`${c.date} ${c.startTime}`)) &&
          c.attendees.length < c.classSize
        );
      })
      .sort((a, b) => {
        // Sort classes in chronological order
        return moment(`${b.date} ${b.startTime}`).isBefore(
          moment(`${a.date} ${a.startTime}`)
        )
          ? 1
          : -1;
      });
  }

  resetFilters(): void {
    ['Location', 'Tutor', 'ClassType', 'Date'].forEach(i =>
      this.filterClasses(`selected${i}`, '')
    );
  }

  showBookingModal(c): void {
    this.selectedClass = c;
    this.modalActive = true;
  }

  closeModal(): void {
    this.modalActive = false;
    this.repeatBookings = [];
    this.selectedClass = null;
  }

  toggleBookingView(view): void {
    this.bookingView = view;
  }

  toggleRepeatBooking(_class): void {
    if (this.repeatBookings.indexOf(_class._id) !== -1) {
      const index = this.repeatBookings.indexOf(_class._id);
      this.repeatBookings.splice(index, 1);
    } else {
      this.repeatBookings.push(_class._id);
    }
  }

  getClassesByGroup(classGroup): Array<Class> {
    return this.classes.filter(c => c.classGroup._id === classGroup._id);
  }

  removeRepeatBookings(): void {
    this.repeatBookings = [];
  }

  addAllRepeatBookings(): void {
    this.repeatBookings = [];
    this.repeatBookings = this.getClassesByGroup(
      this.selectedClass.classGroup
    ).map(c => c._id);
  }

  // Transform the list of class id's to existing class objects
  getRepeatClasses(): Array<Class> {
    return this.repeatBookings.map(r => {
      return this.classes.find(c => c._id === r);
    });
  }

  bookClasses(classes): void {
    this.dataService
      .insertBookings({ classes, customer: this.customer })
      .then(response => {
        const data = response['data'];
        if (data.length > 0) {
          this.messages.push({
            message: 'Congratulations, your booking has been confirmed!',
            type: 'success'
          });
          this.modalActive = false;
          this.selectedClass = null;
          this.repeatBookings = [];

          /* Filter the classes to remove ones the customer just booked*/
          data.forEach(c => {
            const index = this.classes.map(_class => _class._id).indexOf(c._id);
            this.classes.splice(index, 1);
          });

          this.resetFilters();
        } else {
          this.messages.push({
            message:
              'A problem occurred whilst making your booking, please try again.',
            type: 'error'
          });
        }
      })
      .catch(error => {
        this.messages.push({
          message:
            'A problem occurred whilst making your booking, please try again.',
          type: 'error'
        });
      });
  }

  getClassLink(class_id) {
    return `/classes/${class_id}`;
  }
}
