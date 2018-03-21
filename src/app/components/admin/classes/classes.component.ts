import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Class, getInstance } from 'app/models/class';
import { ClassType } from 'app/models/class-type';
import { Tutor } from 'app/models/tutor';
import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';
import { Skill } from 'app/models/skill';
import { Location } from 'app/models/location';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ClassGroup } from '../../../models/class-group';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  loading = true;
  messages = [];
  classes: Array<Class>;
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private _dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.getClasses();
  }

  private getClasses() {
    this._dataService.getClasses().subscribe(
      res => {
        const data = res['data'];
        this.classes = data.map(c => {
          return getInstance(c);
        });
        this.initCalendar();
        this.loading = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  private initCalendar() {
    const scrollTime = moment.duration(moment().format('HH') + ':00:00');
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      fixedWeekCount: false,
      allDaySlot: false,
      eventColor: '#3273dc',
      timeFormat: 'HH:mm',
      scrollTime,
      defaultView: 'agendaWeek',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.classes.map(c => {
        return {
          title: c.type.name,
          start: `${c.date}T${c.startTime}:00`,
          end: `${c.date}T${c.endTime}:00`,
          path: `/classes/${c._id}`
        };
      })
    };
  }

  eventClick(e) {
    this.router.navigate([e.event.path]);
  }
}
