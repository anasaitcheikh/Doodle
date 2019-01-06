import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  createAccount(user) {
    return this.http.post('http://localhost:8080/api/close/users',
      {
        data: {
          user: user
        }
      }
    )
  }

}
