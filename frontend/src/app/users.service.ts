import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

   addUser = false;
  createAccount(user){

    this.http.post('http://localhost:8080/api/close/users',
      {
         data : {
            user: {
              email: user.email,
              password: user.password,
              name: user.name

            }
         }
      }
      ).subscribe(
      data => {
        //console.log("create account success ");
        console.log(data);
        this.addUser = true;
      },
      error => {
        console.log("Error", error);
      }
    );
    return this.addUser;
  }

}
