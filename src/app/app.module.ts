import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'app/routing/app-routing.module';

import { AppComponent } from 'app/app.component';

/* Common components */
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { IndexComponent } from 'app/components/index/index.component';
import { LoginComponent } from 'app/components/login/login.component';
import { PagenotfoundComponent } from 'app/components/pagenotfound/pagenotfound.component';
import { StatusComponent } from './components/status/status.component';

/* Admin Components */
import { DashboardComponent as AdminDashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AdminAllCustomers } from 'app/components/admin/customers/customers.component';
import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';
import { TutorsComponent as AdminTutors } from 'app/components/admin/tutors/tutors.component';

/* Guest components */
import { LocationsComponent } from './components/guest/locations/locations.component';

/* Services */
import { DataService } from 'app/services/data.service';
import { LocationComponent } from './components/admin/locations/location/location.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PagenotfoundComponent,
    IndexComponent,
    AdminDashboard,
    AdminAllCustomers,
    AdminLocations,
    AdminTutors,
    StatusComponent,
    LocationsComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
