import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from 'app/app.component';
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { LoginComponent } from 'app/components/login/login.component';
import { PagenotfoundComponent } from 'app/components/pagenotfound/pagenotfound.component';
import { IndexComponent } from 'app/components/index/index.component';
import { DashboardComponent as AdminDashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AdminAllCustomers } from 'app/components/admin/customers/customers.component';
import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';

import { DataService } from 'app/services/data.service';

const routes: Routes = [
  {
    path: '', component: IndexComponent
  },
  {
    path: 'login', component: LoginComponent
  },
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
      }
    ]
  },
  {
    path: '**', component: PagenotfoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PagenotfoundComponent,
    IndexComponent,
    AdminDashboard,
    AdminAllCustomers,
    AdminLocations
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
