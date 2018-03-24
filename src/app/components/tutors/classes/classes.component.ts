import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Class, getInstance } from 'app/models/class';
import { Tutor } from 'app/models/tutor';
import { Skill } from 'app/models/skill';
import { Location } from 'app/models/location';
import { OpenHours } from 'app/models/openHours';
import { Venue } from 'app/models/venue';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tutor-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  loading = true;
  messages = [];
  classes: Array<Class>;
  calendarOptions: Options;
  colors = [
    '#fc5c65',
    '#fd9644',
    '#fed330',
    '#26de81',
    '#2bcbba',
    '#eb3b5a',
    '#fa8231',
    '#f7b731',
    '#20bf6b',
    '#0fb9b1',
    '#45aaf2',
    '#4b7bec',
    '#a55eea',
    '#778ca3',
    '#2d98da',
    '#3867d6',
    '#8854d0',
    '#a5b1c2',
    '#4b6584'
  ];
  tutorColors = [];
  showAllClasses = true;
  tutor = null;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(
    private _dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getIdentity().subscribe(
      response => {
        const t = response['data'];
        this.tutor = new Tutor(
          t._id,
          t.forename,
          t.surname,
          t.gender,
          t.phone,
          t.user,
          t.skills
        );
      },
      error => console.log(error)
    );
    this.getClasses();
  }

  private getClasses() {
    this._dataService.getClasses().subscribe(
      res => {
        const data = res['data'];
        this.classes = data
          // .filter(c => {
          //   return moment(`${c.date} ${c.startTime}`).isAfter(moment());
          // })
          .map(c => {
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
    // After the tutor colors have been set, set the calendar options
    this.setTutorColours()
      .then(() => {
        const scrollTime = moment.duration(moment().format('HH') + ':00:00');
        this.calendarOptions = {
          editable: false,
          eventLimit: false,
          fixedWeekCount: false,
          allDaySlot: false,
          timeFormat: 'HH:mm',
          defaultView: 'agendaWeek',
          scrollTime: scrollTime,
          selectable: true,
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
          },
          events: this.mapClassesToEvents(this.classes)
        };
      })
      .catch(() =>
        console.log('An error occurred whilst trying to set the tutor colors')
      );
  }

  private mapClassesToEvents(classes) {
    return classes.map(c => {
      return {
        title: c.type.name,
        start: `${c.date}T${c.startTime}:00`,
        end: `${c.date}T${c.endTime}:00`,
        path: `/classes/${c._id}`,
        color: this.tutorColors.filter(
          t => t.tutorName === `${c.tutor.forename} ${c.tutor.surname}`
        )[0].color
      };
    });
  }

  // Set the color for each tutor, then return the promise
  private setTutorColours(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      let count = 0;
      this.classes.forEach(c => {
        if (
          this.tutorColors.filter(
            t => t.tutorName === `${c.tutor.forename} ${c.tutor.surname}`
          ).length === 0
        ) {
          if (this.colors.length > 0) {
            this.tutorColors.push({
              tutorName: `${c.tutor.forename} ${c.tutor.surname}`,
              color: this.colors[count]
            });
            this.colors.splice(count, 1);
          } else {
            this.tutorColors.push({
              tutorName: `${c.tutor.forename} ${c.tutor.surname}`,
              color: this.colors['#3a87ad']
            });
          }
        }
        count++;
      });

      resolve(true);
    });
  }

  toggleAllClasses() {
    this.showAllClasses = !this.showAllClasses;
    if (this.showAllClasses) {
      this.ucCalendar.renderEvents(this.mapClassesToEvents(this.classes));
    } else {
      const filteredClasses = this.classes.filter(
        c => c.tutor._id === this.tutor._id
      );
      this.ucCalendar.renderEvents(this.mapClassesToEvents(filteredClasses));
    }
  }

  eventClick(e) {
    this.router.navigate([e.event.path]);
  }

  selectTime(e) {
    let { start, end } = e.detail;
    start = moment(start).format('YYYY-MM-DD HH:mm:ss');
    end = moment(end).format('YYYY-MM-DD HH:mm:ss');
    if (moment().isBefore(start)) {
      this.router.navigate(['/tutor/classes/new'], {
        queryParams: { start, end }
      });
    }
  }
}
