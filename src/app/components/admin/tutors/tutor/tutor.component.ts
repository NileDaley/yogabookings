import {Component, OnInit} from '@angular/core';
import {Tutor} from 'app/models/tutor';
import {Skill} from 'app/models/skill';
import {DataService} from '../../../../services/data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit {

  loading = false;
  messages = [];
  editing = false;
  tutor: Tutor = null;
  availableSkills: Array<Skill>;

  constructor(private _dataService: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loading = true;
    const id: string = this.route.snapshot.paramMap.get('id');
    this.getTutor(id);
  }

  private getTutor(id: string) {
    this._dataService.getTutor(id)
      .subscribe(
        res => {
          const data = res['data'];
          this.tutor = new Tutor(
            data._id,
            data.forename,
            data.surname,
            data.gender,
            data.phone,
            data.user,
            data.skills.map(s => new Skill(s._id, s.name, s.description)));

          this.getAllSkills();
          this.loading = false;
        },
        () => {
          this.messages.push({message: 'An error occurred while retrieving tutor skills', type: 'error'});
        }
      );
  }

  private getAllSkills() {
    this._dataService.getSkills()
      .subscribe(res => {

          let data = res['data'];
          data = data
            .map(skill => new Skill(skill._id, skill.name, skill.description));

          this.tutor.skills.forEach(s => {
            data.forEach(skill => {
              if (skill.name === s.name) {
                data.splice(data.indexOf(skill), 1);
              }
            });
          });

          this.availableSkills = data;
        },
        () => {
          this.messages.push({message: 'An error occurred while retrieving tutor skills', type: 'error'});
        });
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  discardEdit() {
    this.getTutor(this.tutor._id);
    this.editing = false;
  }

  removeSkill(skill) {
    this.tutor.skills.splice(this.tutor.skills.indexOf(skill), 1);
    this.availableSkills.push(skill);
  }

  addSkill(skill) {
    this.availableSkills.splice(this.availableSkills.indexOf(skill), 1);
    this.tutor.skills.push(skill);
  }

  saveTutor() {
    this._dataService
      .updateTutor(this.tutor._id, this.tutor)
      .subscribe(res => {

          let type, message;

          if (res['data']['status'] === false) {

            if (res['data']['matched'] === 0) {
              message = `${this.tutor.forename} ${this.tutor.surname} could not be found in the database, please refresh the page and try again.`;
              type = 'error';
            } else if (res['data']['modified'] === 0) {
              message = `None of the details for ${this.tutor.forename} ${this.tutor.surname} were changed`;
              type = 'warning';
            }

          } else {
            this.getTutor(this.tutor._id);
            message = `${this.tutor.forename} ${this.tutor.surname} was updated successfully`;
            type = 'success';
          }

          this.toggleEdit();
          this.messages.push({'message': message, 'type': type});

        },
        () => {

        });
  }

}
