import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as Dashboard } from 'app/components/tutors/dashboard/dashboard.component';
import { ClassesComponent } from '../components/tutors/classes/classes.component';
import { RouterGuard } from './router.guard';
import { NewClassComponent } from '../components/tutors/new-class/new-class.component';

const tutorRoutes: Routes = [
  {
    path: 'tutor',
    component: Dashboard,
    canActivate: [RouterGuard],
    data: {
      expectedRole: 10
    },
    children: [
      {
        path: '',
        redirectTo: 'classes',
        pathMatch: 'full'
      },
      {
        path: 'classes/new',
        component: NewClassComponent
      },
      {
        path: 'classes',
        component: ClassesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(tutorRoutes)],
  exports: [RouterModule]
})
export class TutorRoutingModule {}
