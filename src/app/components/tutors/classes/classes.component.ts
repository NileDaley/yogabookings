import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Class } from 'app/models/class';
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

@Component({
  selector: 'app-tutor-classes',
  templateUrl: './classes.component.html',
  styleUrls: [ './classes.component.scss' ]
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
  showAllClasses = false;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor( private _dataService: DataService, private router: Router ) {
  }

  ngOnInit() {
    this.getClasses();
  }

  private getClasses() {
    this._dataService.getClasses()
      .subscribe(res => {
        const data = res[ 'data' ];
        this.classes = data.map(c => {
          return new Class(
            c._id,
            new ClassType(
              c.classType._id,
              c.classType.name,
              c.classType.description
            ),
            new Tutor(
              c.tutor._id,
              c.tutor.forename,
              c.tutor.surname,
              c.tutor.gender,
              c.tutor.phone,
              new User(c.tutor.user.email, null, c.tutor.user.role),
              c.tutor.skills.map(s => new Skill(s._id, s.name, s.description))
            ),
            c.attendees.map(a => new Customer(
              a._id,
              a.forename,
              a.surname,
              a.phone,
              a.gender,
              new User(a.user.email, null, a.role)
            )),
            c.date,
            c.startTime,
            c.endTime,
            c.classSize,
            c.price,
            new Location(
              c.location._id,
              c.location.name,
              c.location.address,
              c.location.email,
              c.location.phone,
              c.location.openHours.map(day => new OpenHours(day.day, day.isOpen, day.open, day.close)),
              c.location.venues.map(v => new Venue(v.name, v.capacity))
            ),
            c.venue,
            c.hasOwnProperty('classGroup') ?
              new ClassGroup(
                c.classGroup._id,
                c.classGroup.startDate,
                c.classGroup.interval,
                c.classGroup.count
              )
              : null
          );
        });
        this.initCalendar();
        this.loading = false;
      }, err => {
        console.log(err);
      });
  }

  private initCalendar() {

    // After the tutor colors have been set, set the calendar options
    this.setTutorColours()
      .then(() => {
        this.calendarOptions = {
          editable: false,
          eventLimit: false,
          fixedWeekCount: false,
          allDaySlot: false,
          timeFormat: 'HH:mm',
          defaultView: 'agendaWeek',
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
          },
          events: this.classes.map(c => {
            return {
              'title': c.type.name,
              'start': `${c.date}T${c.startTime}:00`,
              'end': `${c.date}T${c.endTime}:00`,
              'path': `/admin/classes/${c._id}`,
              'color': this.tutorColors.filter(t => t.tutorName === `${c.tutor.forename} ${c.tutor.surname}`)[ 0 ].color
            };
          })
        };
      })
      .catch(() => console.log('An error occurred whilst trying to set the tutor colors'));

  }

  // Set the color for each tutor, then return the promise
  private setTutorColours(): Promise<boolean> {

    return new Promise<boolean>(resolve => {

      this.classes.forEach(c => {

        if ( this.tutorColors.filter(t => t.tutorName === `${c.tutor.forename} ${c.tutor.surname}`).length === 0 ) {
          if ( this.colors.length > 0 ) {
            const randomIndex = Math.floor(Math.random() * this.colors.length);
            this.tutorColors.push({
              tutorName: `${c.tutor.forename} ${c.tutor.surname}`,
              color: this.colors[ randomIndex ]
            });
            this.colors.splice(randomIndex, 1);
          } else {
            this.tutorColors.push({
              tutorName: `${c.tutor.forename} ${c.tutor.surname}`,
              color: this.colors[ '#3a87ad' ]
            });
          }
        }

      });

      resolve(true);

    });

  }

  eventClick( e ) {
    this.router.navigate([ e.event.path ]);
  }

}
