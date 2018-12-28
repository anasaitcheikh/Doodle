import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticateService} from "./authenticate.service";
import {User} from "../utils/types";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  //userSession;
  //userName;
  userSession : User;
  userData;
  constructor(private router: Router, private authenticateService:AuthenticateService){
     if(localStorage.getItem('currentUser')){
       console.log("there is user logged!");
       this.userData = JSON.parse(localStorage.getItem('currentUser'));
       this.userSession = {
          name : this.userData.data.user.name,
          email : this.userData.data.user.email,
         password : this.userData.data.user.password
       }
       console.log("app component: user name");
       console.log(this.userSession.name);
     }
  }


  ngOnInit(){

  }
  logout(){
    this.authenticateService.logout();
  }

}
