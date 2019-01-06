import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  userSession;
  userName;
  userEmail;
  userPassword;
  constructor() {
    this.userSession = JSON.parse(localStorage.getItem('currentUser'));
    this.userName = this.userSession.data.user.name;
    this.userEmail = this.userSession.data.user.email;
    this.userPassword = this.userSession.data.user.password;
    console.log("password");
    console.log(this.userPassword);
  }

  ngOnInit() {
  }

}
