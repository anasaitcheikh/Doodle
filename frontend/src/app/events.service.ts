import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http'; 

@Injectable()
export class EventsService {

  constructor(private http:HttpClient) {
      
  }

  events = [
     {
       date: "16 novembre 2018",
       email: "doumbiadoussou197@yahoo.fr",
       h_dep: "20h",
       h_fin: "23h",
       lieu: "Créteil",
       nbmax_part: 5,
       nom: "doussou",
       note: "middleware",
       titre: "reunion"
     },
     {
       date: "26 décembre 2018",
       email: "mid@upec.fr",
       h_dep: "20h",
       h_fin: "23h",
       lieu: "Paris",
       nbmax_part: 5,
       nom: "doussou",
       note: "notre projet",
       titre: "projet"
     },
     

   ];

  addEvent(event){
     this.events.push(event);
     console.log("try call API");
    //post data on API
    //httpHeaders = new HttpHeaders({
    // 'Content-Type' : 'application/json',
     //'Cache-Control': 'no-cache'
     //});

    // options = {
     //headers: httpHeaders
     //};

    const req = this.http.post('http://localhost:8080/api/open/reunions/',
      {
        data:event
      })
      .subscribe(
        data => {
          console.log("POST Request is successful ", data);
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getAllEvents(){
     return this.events;
  }
}
