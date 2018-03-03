import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as Dashboard } from 'app/components/tutors/dashboard/dashboard.component';
import { ClassesComponent } from '../components/tutors/classes/classes.component';

const tutorRoutes: Routes = [
  {
    path: 'tutor', component: Dashboard,
    children: [
      {
        path: 'classes',
        component: ClassesComponent
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(tutorRoutes) ],
  exports: [ RouterModule ]
})

export class TutorRoutingModule {
}
