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
import { CustomerRegistrationComponent as AdminCustomerRegistration } from 'app/components/admin/customers/customer-registration/customer-registration.component';

import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';
import { LocationComponent as AdminSingleLocation } from 'app/components/admin/locations/location/location.component';

import { TutorsComponent as AdminTutors } from 'app/components/admin/tutors/tutors.component';
import { TutorComponent as AdminSingleTutor } from 'app/components/admin/tutors/tutor/tutor.component';
import { TutorRegistrationComponent as AdminTutorRegistration } from 'app/components/admin/tutors/tutor-registration/tutor-registration.component';
import { SkillsComponent as AdminTutorSkills } from 'app/components/admin/tutors/skills/skills.component';
import { SkillComponent as AdminTutorSkill } from './components/admin/tutors/skills/skill/skill.component';

/* Guest components */
import { LocationsComponent as GuestLocations } from 'app/components/guest/locations/locations.component';

/* Services */
import { DataService } from 'app/services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PagenotfoundComponent,
    IndexComponent,
    AdminDashboard,
    AdminAllCustomers,
    AdminCustomerRegistration,
    AdminLocations,
    AdminSingleLocation,
    AdminTutors,
    AdminTutorSkills,
    AdminTutorSkill,
    StatusComponent,
    GuestLocations,
    AdminSingleTutor,
    AdminTutorRegistration
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
