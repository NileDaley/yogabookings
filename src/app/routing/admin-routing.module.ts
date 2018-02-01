import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as AdminDashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AdminAllCustomers } from 'app/components/admin/customers/customers.component';
import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';
import { LocationComponent as AdminSingleLocation } from 'app/components/admin/locations/location/location.component';
import { TutorsComponent as AdminTutors } from 'app/components/admin/tutors/tutors.component';
import { TutorComponent as AdminSingleTutor} from 'app/components/admin/tutors/tutor/tutor.component';
import { SkillsComponent as AdminSkills } from 'app/components/admin/tutors/skills/skills.component';

const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminDashboard,
    children: [
      {
        path: 'customers',
        component: AdminAllCustomers
      },
      {
        path: 'locations/:id',
        component: AdminSingleLocation
      },
      {
        path: 'locations',
        component: AdminLocations
      },
      {
        path: 'tutors',
        component: AdminTutors
      },
      {
        path: 'tutors/skills',
        component: AdminSkills
      },
      {
        path: 'tutors/:id',
        component: AdminSingleTutor
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
