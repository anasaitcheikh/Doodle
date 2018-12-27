import { Component, OnInit } from '@angular/core';
import {UsersService} from "../users.service";
import { Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  addUser : boolean;
  testPassword : boolean;
  constructor(private userService:UsersService,
              private router:Router) { }

  ngOnInit() {
  }
  createAccount(user){
      if(user.password == user.confirm_password){
        this.testPassword = true;
        this.addUser = this.userService.createAccount(user);
        if(this.addUser){
          this.router.navigate(['']);
        }
      }
      else {
        this.testPassword = false;
      }
  }
}
