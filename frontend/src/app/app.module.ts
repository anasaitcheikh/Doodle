import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule }  from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';
import { LogInComponent } from './log-in/log-in.component';
import { EventsComponent } from './events/events.component';
import { EventsService } from './events.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './welcome/welcome.component';
import { CreateEventComponent } from './create-event/create-event.component';

const routes:Routes=[
   {path:'events', component:EventsComponent},
   {path:'login', component: LogInComponent},
   {path:'welcome', component: WelcomeComponent},
   {path:'createEvent', component: CreateEventComponent},
   {path:'', redirectTo: '/welcome', pathMatch:'full'},

]

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    LogInComponent,
    EventsComponent,
    WelcomeComponent,
    CreateEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
