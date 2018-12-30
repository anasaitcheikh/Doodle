import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from "../authenticate.service";
import { UsersService } from "../users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../utils/types";
import {style} from "@angular/animations";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private authenticateService: AuthenticateService,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService) {

  }
  log = false;
  isSignIn : boolean;
  ngOnInit() {
  }


  login(form) {
    //document.getElementById('loader').style.display = 'block';
    this.authenticateService.login(form.email, form.password)
      .subscribe(
        data => {
          console.log("login successful!");
          console.log("data");
          console.log(data);
          this.router.navigate(['']);
          //document.getElementById('loader').style.display = 'none';
        },
        error => {
          console.log(error);
        }
      );
  }


  signin(form) {
    if (form.password == form.confirm_password) {
      const user: User = {
        name: form.name,
        email: form.email,
        password: form.password
      }
      console.log(user)
      this.usersService.createAccount(user).
        subscribe(res => {
          console.log(res);
          this.isSignIn = true;
          document.getElementById('dialogButton').click();
        }
      )
    }
    else {
      //return false;
      this.isSignIn = false;
    }
  }
}
