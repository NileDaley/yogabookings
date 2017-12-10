import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from 'app/components/index/index.component';
import { LoginComponent } from 'app/components/login/login.component';

import { PagenotfoundComponent } from 'app/components/pagenotfound/pagenotfound.component';
import { AdminRoutingModule } from 'app/routing/admin-routing.module';

const appRoutes: Routes = [
  {
    path: '', component: IndexComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '**', component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes), AdminRoutingModule],
  exports: [RouterModule]
})

export class AppRoutingModule { }
