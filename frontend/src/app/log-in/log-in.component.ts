import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from "../authenticate.service";
import { UsersService } from "../users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../utils/types";

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
  returnUrl: string
  log = false;

  ngOnInit() {
  }


  login(form) {
    this.authenticateService.login(form.email, form.password)
      .subscribe(
        data => {
          console.log("login successful!");
          console.log("data");
          console.log(data);
          this.router.navigate(['']);
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
        subscribe(res => console.log(res))
    }
    else {
      return false;
    }
  }
}
