import { Component, OnInit } from '@angular/core';
import { AuthenticateService} from "../authenticate.service";
import {ActivatedRoute} from "@angular/router";
import { Router} from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private authenticateService:AuthenticateService,
              private router: Router,
              private route : ActivatedRoute ){

  }
  returnUrl: string
  log = false;

  ngOnInit() {
    // reset login status
    this.authenticateService.logout();

    // get return url from route parameters or default to '/'
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(form){
     this.authenticateService.login(form.login,form.password)
       .subscribe(
         data => {
            console.log("login successful!");
           console.log("data");
           console.log(data);
            this.router.navigate(['dashboard']);
         },
         error => {
              console.log(error);
         }
       );

  }
}
