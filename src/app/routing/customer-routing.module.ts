import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { RouterGuard } from './router.guard';
import { CustomerProfileComponent } from '../components/customer/customer-profile/customer-profile.component';

const customerRoutes: Routes = [
  {
    path: 'customer',
    canActivate: [RouterGuard],
    component: CustomerProfileComponent,
    data: {
      expectedRole: 0
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
