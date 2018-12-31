import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { InvitationsComponent} from "./invitations/invitations.component";
import {TutorialComponent} from "./tutorial/tutorial.component";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule,  NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,

} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { EventsComponent } from './events/events.component';
import { EventsService } from './events.service';
import { AuthenticateService} from "./authenticate.service";
import { UsersService} from "./users.service";
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './welcome/welcome.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { CommentsDetailsComponent } from './comments-details/comments-details.component';
import { CloseEventsComponent } from './close-events/close-events.component';
import { ShowEventComponent } from './show-event/show-event.component';

const routes:Routes=[
   {path:'open-event/:token', component:EventsComponent},
   {path:'login', component: LogInComponent},
   {path:'welcome', component: WelcomeComponent},
   {path:'createEvent', component: CreateEventComponent},
   {path:'profile', component: ProfileComponent},
   {path:'invitations', component: InvitationsComponent},
   {path:'tutorial', component: TutorialComponent},
   {path:'comments-details', component: CommentsDetailsComponent},
   {path:'account-settings', component: AccountSettingsComponent},
   {path:'reset-password', component: ResetPasswordComponent},
   {path:'close-events', component: CloseEventsComponent},
   {path:'show-event/:id_event', component: ShowEventComponent},
   {path:'', redirectTo: 'welcome', pathMatch:'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    EventsComponent,
    WelcomeComponent,
    CreateEventComponent,
    DashboardComponent,
    AccountSettingsComponent,
    ResetPasswordComponent,
    ProfileComponent,
    TutorialComponent,
    InvitationsComponent,
    HeaderComponent,
    CloseEventsComponent,
    ShowEventComponent,
    CommentsDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AngularFontAwesomeModule,
  ],
  providers: [EventsService,
              AuthenticateService,
              UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
