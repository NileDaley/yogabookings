import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Skill } from '../../../../models/skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills: any[];
  filteredSkills: any[];
  isAddingSkill = false;
  newSkill: Skill;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.getSkills();
  }

  private getSkills() {
    this._dataService.getSkills().then(res => {
      const data = res['data'];
      this.skills = data.map(
        skill => new Skill(skill._id, skill.name, skill.description)
      );
      this.filteredSkills = this.skills;
      this.newSkill = new Skill('', '', '');
    });
  }

  filter(criteria: String) {
    criteria = criteria.toLowerCase();
    if (criteria === '') {
      this.filteredSkills = this.skills;
    } else {
      this.filteredSkills = this.skills.filter(skill => {
        return (
          skill.name.toLowerCase().includes(criteria) ||
          skill.description.toLowerCase().includes(criteria)
        );
      });
    }
  }

  discardNewSkill() {
    this.isAddingSkill = false;
    this.newSkill = new Skill('', '', '');
  }

  saveNewSkill() {
    this._dataService.insertSkill(this.newSkill).then(res => {
      // reset the new skill, get all skills and toggle isAddingSkill
      this.getSkills();
      this.isAddingSkill = false;
    });
  }
}
