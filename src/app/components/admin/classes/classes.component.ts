import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Class } from 'app/models/class';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: [ './classes.component.scss' ]
})
export class ClassesComponent implements OnInit {

  loading = true;
  messages = [];
  classes: Array<Class>;
  constructor( private _dataService: DataService ) {
  }

  ngOnInit() {
  }

}
