import { Component, OnInit } from '@angular/core';
import {UsersService} from "../users.service";
import { Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private userService:UsersService,
              private router:Router) { }

  ngOnInit() {
  }
  createAccount(user){
     this.userService.createAccount(user)
       .subscribe(
         data => {
           console.log("data");
           console.log(data);
           this.router.navigate(['/']);
         },
         error => {
           console.log(error);
         }
       );
}
}
