import { Component, OnInit } from '@angular/core';
import { Tutor } from 'app/models/tutor';
import { Skill } from 'app/models/skill';
import { User, Role } from 'app/models/user';
import { DataService } from '../../../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutors',
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.scss']
})
export class TutorsComponent implements OnInit {
  tutors: Array<Tutor>;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.getTutors();
  }

  private getTutors() {
    this._dataService.getTutors().subscribe(
      res => {
        const data: Array<any> = res['data'];
        this.tutors = data.map(t => {
          return new Tutor(
            t._id,
            t.forename,
            t.surname,
            t.gender,
            t.phone,
            t.user,
            t.skills
          );
        });
      },
      error => console.log(error)
    );
  }
}
