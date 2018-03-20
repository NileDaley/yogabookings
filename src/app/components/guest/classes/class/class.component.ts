import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { AuthService } from '../../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Class, getInstance } from '../../../../models/class';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  _class: Class;
  loading = true;
  constructor(
    private _dataService: DataService,
    private _authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getClass();
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
}
