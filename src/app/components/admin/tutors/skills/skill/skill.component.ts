import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Skill} from '../../../../../models/skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {

  skill: Skill;
  loading = true;
  messages = [];

  constructor(private _dataService: DataService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.getSkill(this.route.snapshot.paramMap.get('id'));
  }

  private getSkill(id) {
    this._dataService.getSkill(id).subscribe(res => {
      const data = res['data'];
      this.skill = new Skill(data._id, data.name, data.description);
      this.loading = false;
    }, err => {
      this.messages.push({
        message: 'An error occured whilst retrieving the skill from the database',
        type: 'error'
      });
    });
  }

  saveSkill() {
    this._dataService.updateSkill(this.skill._id, this.skill).subscribe(res => {

      let type, message;

      if (res['data']['status'] === false) {

        if (res['data']['matched'] === 0) {
          message = `"${this.skill.name}" could not be found in the database, please refresh the page and try again.`;
          type = 'error';
        } else if (res['data']['modified'] === 0) {
          message = `None of the details for "${this.skill.name}" were changed`;
          type = 'warning';
        }

        this.messages.push({'message': message, 'type': type});

      } else {
        this.router.navigate(['/admin/tutors/skills']);
      }

    }, () => {
      this.messages.push({
        message: 'An error occurred whilst updating the skill',
        type: 'error'
      });
    });
  }

  discardEdit() {
    this.router.navigate(['/admin/tutors/skills']);
  }


}
