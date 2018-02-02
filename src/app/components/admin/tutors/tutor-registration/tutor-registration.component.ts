import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../services/data.service';
import {Tutor} from '../../../../models/tutor';
import {Skill} from '../../../../models/skill';
import {Role, User} from '../../../../models/user';

@Component({
  selector: 'app-tutor-registration',
  templateUrl: './tutor-registration.component.html',
  styleUrls: ['./tutor-registration.component.scss']
})
export class TutorRegistrationComponent implements OnInit {

  tutor: Tutor;
  availableSkills: Array<Skill>;
  messages = [];
  loading = true;

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
    this.initializeTutor();
    this.getSkills();
  }

  private initializeTutor() {
    this.tutor = new Tutor(
      null,
      '',
      '',
      '',
      '',
      new User('', '', Role.Tutor),
      []
    );
  }

  private getSkills() {
    this._dataService.getSkills().subscribe(res => {

        let data = res['data'];
        data = data
          .map(skill => new Skill(skill._id, skill.name, skill.description));

        // Remove skills from available skills if they are present in tutor.skills
        this.tutor.skills.forEach(s => {
          data.forEach(skill => {
            if (skill.name === s.name) {
              data.splice(data.indexOf(skill), 1);
            }
          });
        });

        this.availableSkills = data;
        this.loading = false;

      },
      err => {
        console.log(err);
      });
  }

  insertTutor(): void {
    this._dataService.insertTutor(this.tutor)
      .subscribe(res => {
        const newTutor = res['data'];
        this.messages.push({
          message: `${newTutor.forename} ${newTutor.surname} registered successfully`,
          type: 'success'
        });

        this.initializeTutor();
        this.getSkills();

      }, () => {
        this.messages.push({
          message: `An error occured while trying to register ${this.tutor.forename} ${this.tutor.surname}`,
          type: 'error'
        });
      });
  }

  removeSkill(skill) {
    this.tutor.skills.splice(this.tutor.skills.indexOf(skill), 1);
    this.availableSkills.push(skill);
  }

  addSkill(skill) {
    this.availableSkills.splice(this.availableSkills.indexOf(skill), 1);
    this.tutor.skills.push(skill);
  }
}
