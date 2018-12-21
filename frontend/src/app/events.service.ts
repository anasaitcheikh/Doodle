import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class EventsService {

  constructor(private http:Http) { 
      
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
    const req = this.http.post('http://localhost:8080/api/open/reunions/', {
      event
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  getAllEvents(){
     return this.events;
  }
}
