import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from 'app/routing/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from 'app/app.component';
import { FullCalendarModule } from 'ng-fullcalendar';

/* Common components */
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { IndexComponent } from 'app/components/index/index.component';
import { LoginComponent } from 'app/components/login/login.component';
import { PagenotfoundComponent } from 'app/components/pagenotfound/pagenotfound.component';
import { StatusComponent } from './components/status/status.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { MessagesComponent } from './components/shared/messages/messages.component';

/* Admin Components */
import { DashboardComponent as AdminDashboard } from 'app/components/admin/dashboard/dashboard.component';
import { CustomersComponent as AdminAllCustomers } from 'app/components/admin/customers/customers.component';
import { CustomerRegistrationComponent as AdminCustomerRegistration } from 'app/components/admin/customers/customer-registration/customer-registration.component';
import { CustomerComponent as AdminSingleCustomer } from './components/admin/customers/customer/customer.component';

import { LocationsComponent as AdminLocations } from 'app/components/admin/locations/locations.component';
import { LocationComponent as AdminSingleLocation } from 'app/components/admin/locations/location/location.component';

import { TutorsComponent as AdminTutors } from 'app/components/admin/tutors/tutors.component';
import { TutorComponent as AdminSingleTutor } from 'app/components/admin/tutors/tutor/tutor.component';
import { TutorRegistrationComponent as AdminTutorRegistration } from 'app/components/admin/tutors/tutor-registration/tutor-registration.component';
import { SkillsComponent as AdminTutorSkills } from 'app/components/admin/tutors/skills/skills.component';
import { SkillComponent as AdminTutorSkill } from './components/admin/tutors/skills/skill/skill.component';

import { ClassesComponent as AdminClasses } from './components/admin/classes/classes.component';
import { ClassComponent as AdminSingleClass } from './components/admin/classes/class/class.component';
import { NewClassComponent as AdminNewClass } from './components/admin/classes/new-class/new-class.component';

/* Tutor Components */
import { DashboardComponent as TutorDashboard } from './components/tutors/dashboard/dashboard.component';
import { ClassesComponent as TutorClasses } from './components/tutors/classes/classes.component';

/* Guest components */
import { LocationsComponent as GuestLocations } from 'app/components/guest/locations/locations.component';

/* Services */
import { DataService } from 'app/services/data.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { RouterGuard } from './routing/router.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ClassesComponent } from './components/guest/classes/classes.component';

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
    AdminTutorRegistration,
    LoadingComponent,
    MessagesComponent,
    AdminSingleCustomer,
    AdminClasses,
    AdminSingleClass,
    AdminNewClass,
    TutorDashboard,
    TutorClasses,
    ForbiddenComponent,
    ClassesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    AuthService,
    RouterGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
