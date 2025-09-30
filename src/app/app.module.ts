import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './navbar/navbar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FeedbackComponent } from './feedback/feedback.component';
import { UpdatesComponent } from './updates/updates.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './profile/profile.component'; // for drag/drop & clicks
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalenderComponent } from './calender/calender.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavbarComponent,
    FeedbackComponent,
    UpdatesComponent,
    LoginComponent,
    DashboardComponent,
    TaskListComponent,
    TaskDetailsComponent,
    WorkspacesComponent,
    LoaderComponent,
    ProfileComponent,
    CalenderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FullCalendarModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
    
    RouterModule.forRoot([
      {path:"",component:LandingPageComponent},
      {path:"login",component:LoginComponent},
      {path:"feedback",component:FeedbackComponent},
      {path:"updates",component:UpdatesComponent},
      {path:"dashboard",component:DashboardComponent},
      {path:"tasks",component:TaskListComponent},
      {path:"task-details",component:TaskDetailsComponent},
      {path:"workspaces",component:WorkspacesComponent},
      {path:"profile",component:ProfileComponent},
      {path:"calendar",component:CalenderComponent}


    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
