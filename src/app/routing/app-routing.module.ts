import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from 'app/components/index/index.component';
import { LoginComponent } from 'app/components/login/login.component';

import { PagenotfoundComponent } from 'app/components/pagenotfound/pagenotfound.component';
import { AdminRoutingModule } from 'app/routing/admin-routing.module';
import { StatusComponent } from 'app/components/status/status.component';
import { LocationsComponent } from 'app/components/guest/locations/locations.component';
import { TutorRoutingModule } from './tutor-routing.module';
import { ForbiddenComponent } from '../components/forbidden/forbidden.component';
import { ClassesComponent } from '../components/guest/classes/classes.component';

const appRoutes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'classes',
    component: ClassesComponent
  },
  {
    path: 'locations',
    component: LocationsComponent
  },
  {
    path: 'status',
    component: StatusComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: '**',
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    AdminRoutingModule,
    TutorRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
