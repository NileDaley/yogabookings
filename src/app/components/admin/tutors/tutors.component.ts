import {Component, OnInit} from '@angular/core';
import {Tutor} from 'app/models/tutor';
import {Skill} from '../../../models/skill';

@Component({
  selector: 'app-tutors',
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.scss']
})
export class TutorsComponent implements OnInit {

  tutors: Array<Tutor>;

  constructor() {
  }

  ngOnInit() {
    this.getTutors();
  }

  private getTutors() {
    this.tutors = [
      new Tutor('Nile', 'Daley', 'a@b.com', '07988706948', 'pa55word', [
        new Skill('yoga', 'poses and breathing'),
        new Skill('mindfulness', 'thinking about stuff')
      ])
    ];
  }

}
