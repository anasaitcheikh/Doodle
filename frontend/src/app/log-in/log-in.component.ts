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
  private sub = null;
  passwordError: string;
  signInErrorMsg : string;
  signInError: boolean;
  loginError : boolean;
  ngOnInit() {
  }


  login(form) {
    this.loginError = false;
    this.sub = this.authenticateService.login(form.email, form.password)
      .subscribe(
        data => {
          console.log("login successful!");
          console.log("data");
          console.log(data);
          this.router.navigate(['']);

        },
        error => {
          console.log(error);
          this.loginError = true;
        }
      );
  }


  signin(form) {
    this.signInError = false;
    console.log(form.password);
    console.log(form.confirmPassword);
    if (form.password == form.confirmPassword) {
      const user: User = {
        name: form.name,
        email: form.email,
        password: form.password
      }
      console.log(user)
     this.sub = this.usersService.createAccount(user).
        subscribe(res => {
          console.log(res);
          document.getElementById('dialogButton').click();
        },
        error => {
           console.log(error);
           this.signInErrorMsg = "Cet email est déjà associé à un compte";
           this.signInError = true;
        }
      )
    }
    else {
      this.signInErrorMsg = "Les mots de passe ne correspondent pas";
      this.signInError = true;
    }
  }

  ngOnDestroy(){
    if(this.sub ! = undefined && this.sub != null)
      this.sub.unsubscribe();
  }
}
