import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as Dashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AllCustomers } from 'app/components/admin/customers/customers.component';
import { LocationsComponent as Locations } from 'app/components/admin/locations/locations.component';
import { LocationComponent as SingleLocation } from 'app/components/admin/locations/location/location.component';
import { TutorsComponent as Tutors } from 'app/components/admin/tutors/tutors.component';
import { TutorComponent as SingleTutor} from 'app/components/admin/tutors/tutor/tutor.component';
import { SkillsComponent as Skills } from 'app/components/admin/tutors/skills/skills.component';
import { TutorRegistrationComponent as TutorRegistration} from '../components/admin/tutors/tutor-registration/tutor-registration.component';

const adminRoutes: Routes = [
  {
    path: 'admin', component: Dashboard,
    children: [
      {
        path: 'customers',
        component: AllCustomers
      },
      {
        path: 'locations/:id',
        component: SingleLocation
      },
      {
        path: 'locations',
        component: Locations
      },
      {
        path: 'tutors',
        component: Tutors
      },
      {
        path: 'tutors/skills',
        component: Skills
      },
      {
        path: 'tutors/register',
        component: TutorRegistration
      },
      {
        path: 'tutors/:id',
        component: SingleTutor
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
