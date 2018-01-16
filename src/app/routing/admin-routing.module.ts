import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent as AdminDashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AdminAllCustomers } from 'app/components/admin/customers/customers.component';
import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';
import { TutorsComponent as AdminTutors } from 'app/components/admin/tutors/tutors.component';

const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminDashboard,
    children: [
      {
        path: 'customers',
        component: AdminAllCustomers
      },
      {
        path: 'locations',
        component: AdminLocations
      },
      {
        path: 'tutors',
        component: AdminTutors
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
