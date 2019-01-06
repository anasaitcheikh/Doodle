import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable()
export class AuthenticateService {

  constructor(private http:HttpClient) { }

  login(login: string,password: string) {
    return this.http.post('http://localhost:8080/api/close/auth',
      {
        data: {
          user: {
            email: login,
            password: password
          }
        }
      }).pipe(
      map(
        user => {
          // login successful if there's a jwt token in the response
          if (user ) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log("user insert on local storage");
          }
          return user;
        } ));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}

