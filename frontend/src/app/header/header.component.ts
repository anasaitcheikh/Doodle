import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from "../authenticate.service";
import { User } from "../../utils/types";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userSession: User = null;
  userData;

  constructor(private authenticateService: AuthenticateService) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      console.log("there is user logged!");
      this.userData = JSON.parse(localStorage.getItem('currentUser'));
      this.userSession = {
        name: this.userData.data.user.name,
        email: this.userData.data.user.email,
        password: this.userData.data.user.password
      }
      console.log("app component: user name");
      console.log(this.userSession.name);
    }
  }

  logout() {
    this.authenticateService.logout();
  }
}
