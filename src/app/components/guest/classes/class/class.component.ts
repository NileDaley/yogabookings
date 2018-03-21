import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Class, getInstance } from '../../../../models/class';
import { Admin } from '../../../../models/admin';
import { Tutor } from '../../../../models/tutor';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  _class: Class;
  loading = true;
  isLoggedIn: boolean;
  identity = null;
  modalActive = false;
  confirmTutorName: String;

  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getClass();
    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn === true) {
      this.identity = this._authService.getToken();
    }
  }

  private getClass(): void {
    const classID = this.route.snapshot.paramMap.get('id');
    this._dataService.getClass(classID).subscribe(
      response => {
        const data = response['data'];
        this._class = getInstance(data);
        this.loading = false;
      },
      error => console.log(error)
    );
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

  toggleModal(): void {
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
}
