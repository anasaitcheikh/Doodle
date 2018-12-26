import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }


  createAccount(user){

    return this.http.post('http://localhost:8080/api/close/users',
      {
         data : {
            user: {
              email: user.email,
              password: user.password,
              name: user.name

            }
         }
      }
      ).pipe(
      map(
        token => {
          if (token) {
            console.log("create user successful!");
            console.log(token);
          }
          return token;
        } ));

   /* POST http://localhost:8080/api/close/users (creation d un user)

    {
      "data": {
      "user":{
        "email": "email de l'user",
          "password": "azerty",
          "name": "aeae"
      }
    }
    }*/
  }

}
