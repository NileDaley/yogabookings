import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  skills: any[];
  filteredSkills: any[];

  constructor() {
  }

  ngOnInit() {
    this.filteredSkills = this.skills = [
      {name: 'Yoga', description: 'Breath control, meditation, and specific bodily postures for health and relaxation'},
      {name: 'Spiritualism', description: 'Foo bar baz'},
      {name: 'Mindfulness', description: 'Baz bar foo'},
      {name: 'Private Tuition', description: 'One-on-one classes'},
    ];

  }

  filter(criteria: String) {
    criteria = criteria.toLowerCase();
    if (criteria === '') {
      this.filteredSkills = this.skills;
    } else {
      this.filteredSkills = this.skills.filter(skill => {
        return skill.name.toLowerCase().includes(criteria) || skill.description.toLowerCase().includes(criteria);
      });
    }
  }

}
