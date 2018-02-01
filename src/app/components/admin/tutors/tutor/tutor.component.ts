import {Component, OnInit} from '@angular/core';
import {Tutor} from 'app/models/tutor';
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
  tutor: Tutor;

  constructor(private _dataService: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
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
            data.skills);
        },
        error => {
          console.log(error);
        }
      );
  }

}
