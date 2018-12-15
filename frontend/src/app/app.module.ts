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
import { WelcomeComponent } from './welcome/welcome.component';

const routes:Routes=[
   {path:'events', component:EventsComponent},
   {path:'login', component: LogInComponent},
   {path:'welcome', component: WelcomeComponent},
   {path:'', redirectTo: '/welcome', pathMatch:'full'},

]

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    LogInComponent,
    EventsComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
