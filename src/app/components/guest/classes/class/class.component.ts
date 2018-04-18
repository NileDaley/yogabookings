import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Class, getInstance } from '../../../../models/class';
import { Admin } from '../../../../models/admin';
import { Tutor } from '../../../../models/tutor';
import { Customer } from 'app/models/customer';
import { User, Role } from 'app/models/user';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html'
})
export class ClassComponent implements OnInit {
  _class: Class;
  loading = true;
  isLoggedIn: boolean;
  identity = null;
  modalActive = false;
  modalView = null;
  confirmTutorName: String;
  customers: Array<Customer>;
  filteredCustomers: Array<Customer>;
  messages = [];

  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn === true) {
      this.identity = this._authService.getToken();
    }

    this.getClass()
      .then(() => {
        if (this.isLoggedIn && this.identity.role === 20) {
          this.getCustomers().then(() => (this.loading = false));
        } else {
          this.loading = false;
        }
      })
      .catch(error => console.error(error));
  }

  private getClass(): Promise<void> {
    const classID = this.route.snapshot.paramMap.get('id');
    return this._dataService
      .getClass(classID)
      .toPromise()
      .then(response => {
        const data = response['data'];
        this._class = getInstance(data);
        this.loading = false;
      })
      .catch(error => console.error(error));
  }

  private getCustomers(): Promise<void> {
    return this._dataService
      .getCustomers()
      .toPromise()
      .then(res => {
        const data = res['data'];
        this.filteredCustomers = this.customers = data
          .filter(c => {
            return !this._class.attendees.map(a => a._id).includes(c._id);
          })
          .map(c => {
            return new Customer(
              c._id,
              c.forename,
              c.surname,
              c.phone,
              c.gender,
              new User(c.user._id, c.user.email, null, Role.Customer)
            );
          });
      })
      .catch(error => console.error(error));
  }

  getTutorLink(format: 'email' | 'phone'): string {
    const tutor = this._class.tutor;
    if (format === 'email') {
      return `mailto:${
        tutor.user.email
      }?subject=Class enquiry from YogaBookings`;
    } else if (format === 'phone') {
      return `tel:${tutor.phone}`;
    }
    return null;
  }

  canDeleteClass(): boolean {
    if (!this.identity) {
      return false;
    }
    return (
      this.identity.role === 20 ||
      (this.identity.role === 10 &&
        this.identity._id === this._class.tutor.user._id)
    );
  }

  tutorNameMatches(): boolean {
    return (
      this.confirmTutorName ===
      `${this._class.tutor.forename} ${this._class.tutor.surname}`
    );
  }

  toggleModal(view?: String): void {
    if (view) {
      this.modalView = view;
    }
    this.modalActive = !this.modalActive;
    this.confirmTutorName = '';
  }

  deleteClasses(deleteClassGroup = false): void {
    if (deleteClassGroup === true) {
      this._dataService
        .deleteClassGroup(this._class.classGroup._id)
        .toPromise()
        .then(response => {
          this.router.navigate(['/classes']);
        })
        .catch(error => console.log(error));
    } else {
      this._dataService
        .deleteClass(this._class._id)
        .toPromise()
        .then(response => {
          this.router.navigate(['/classes']);
        })
        .catch(error => console.log(error));
    }
  }

  filterCustomers(value: string) {
    console.log(value);
    if (value !== '') {
      value = value.toLowerCase().trim();
      this.filteredCustomers = this.customers.filter(
        c =>
          c.forename.toLowerCase().includes(value) ||
          c.surname.toLowerCase().includes(value)
      );
    } else {
      this.filteredCustomers = this.customers;
    }
  }

  bookClassForCustomer(_id: string) {
    const payload = {
      classes: [this._class],
      customer: this.customers.find(c => c._id === _id)
    };
    this._dataService.insertBookings(payload).subscribe(
      res => {
        this.toggleModal();
        this.loading = true;
        this.getClass().then(() =>
          this.messages.push({
            type: 'success',
            message: 'Customer added to class'
          })
        );
      },
      error => console.error(error)
    );
  }

  removeCustomer(customer: Customer) {
    this.toggleModal();
    this.loading = true;
    this._dataService
      .cancelBookings({
        classes: [this._class],
        customer
      })
      .toPromise()
      .then(() => {
        this.getClass()
          .then(() => {
            this.getCustomers();
            this.messages.push({
              type: 'success',
              message: 'Customer removed from class'
            });
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
}
