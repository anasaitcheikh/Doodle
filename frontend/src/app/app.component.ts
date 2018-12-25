import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticateService} from "./authenticate.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  userSession;
  userName;
  constructor(private router: Router, private authenticateService:AuthenticateService){
     if(localStorage.getItem('currentUser')){
       console.log("there is user logged!");
       this.userSession = localStorage.getItem('currentUser');
       this.userName = JSON.parse(this.userSession).data.user.name;
       console.log("app component: user name");
       console.log(this.userName);
       this.router.navigate(['dashboard']);
     }
  }


  ngOnInit(){

  }
  logout(){
    this.authenticateService.logout();
  }

}
