import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as Dashboard } from 'app/components/admin/dashboard/dashboard.component';

import { CustomersComponent as AllCustomers } from 'app/components/admin/customers/customers.component';
import { CustomerRegistrationComponent as CustomerRegistration } from 'app/components/admin/customers/customer-registration/customer-registration.component';
import { CustomerComponent as SingleCustomer } from 'app/components/admin/customers/customer/customer.component';

import { LocationsComponent as Locations } from 'app/components/admin/locations/locations.component';
import { LocationComponent as SingleLocation } from 'app/components/admin/locations/location/location.component';

import { TutorsComponent as Tutors } from 'app/components/admin/tutors/tutors.component';
import { TutorComponent as SingleTutor } from 'app/components/admin/tutors/tutor/tutor.component';
import { SkillsComponent as Skills } from 'app/components/admin/tutors/skills/skills.component';
import { SkillComponent as SingleSkill } from 'app/components/admin/tutors/skills/skill/skill.component';
import { TutorRegistrationComponent as TutorRegistration } from 'app/components/admin/tutors/tutor-registration/tutor-registration.component';

import { ClassesComponent as Classes} from '../components/admin/classes/classes.component';
import { ClassComponent as SingleClass} from '../components/admin/classes/class/class.component';
import { NewClassComponent as NewClass} from '../components/admin/classes/new-class/new-class.component';

const adminRoutes: Routes = [
  {
    path: 'admin', component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'classes',
        pathMatch: 'full'
      },
      {
        path: 'customers',
        component: AllCustomers
      },
      {
        path: 'customers/register',
        component: CustomerRegistration
      },
      {
        path: 'customers/:id',
        component: SingleCustomer
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
        path: 'tutors/skills/:id',
        component: SingleSkill
      },
      {
        path: 'tutors/register',
        component: TutorRegistration
      },
      {
        path: 'tutors/:id',
        component: SingleTutor
      },
      {
        path: 'classes',
        component: Classes
      },
      {
        path: 'classes/new',
        component: NewClass
      },
      {
        path: 'classes/:id',
        component: SingleClass
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(adminRoutes) ],
  exports: [ RouterModule ]
})

export class AdminRoutingModule {
}
