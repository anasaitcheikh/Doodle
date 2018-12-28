import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { MatTableModule } from '@angular/material/table';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

/*
interface Reunion {
  data: {
    reunion: {
      id: any;
      date: string[];
      comment: string[];
      participant: string[];
      create_at: Date;
      update_at: Date;
      title: string;
      place: string;
      note: string;
      addComment: string;
      maxParticipant: Int32Array;
      admin: any[];
      _v: Int32Array;
    }
  }
}
*/

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  events = [];

/*
  reponse = {
    data: {
      reunion: {
        _id: "5c1d256c15816d61753461c2",
        date: [
          {
            date: "2018-12-31T00:00:00.000Z",
            _id: "5c1d259015816d61753461c3",
            hourStart: "9h",
            hourEnd: "18h"
          }
        ],
        comment: [
          {
            create_at: "2018-12-21T17:40:32.780Z",
            update_at: "2018-12-21T17:40:32.780Z",
            _id: "5c1d259015816d61753461c4"
          },
          {
            create_at: "2018-12-22T01:29:26.146Z",
            update_at: "2018-12-22T01:29:26.146Z",
            _id: "5c1d9376cb1d2964a72a6a3c",
            name: "Moi Toi",
            email: "part3@part.com",
            text: "ceci est un commentaire"
          }
        ],
        participant: [
          {
            create_at: "2018-12-21T18:59:30.359Z",
            update_at: null,
            _id: "5c1d3812fc3743621450978e",
            email: "part11@part.com",
            name: "Holla Toi"
          },
          {
            create_at: "2018-12-21T20:42:48.221Z",
            update_at: "2018-12-21T20:42:48.221Z",
            _id: "5c1d50482946b7631083a443",
            email: "part2@part.com",
            name: "Moi Toi"
          },
          {
            create_at: "2018-12-22T01:18:59.477Z",
            update_at: "2018-12-22T01:18:59.477Z",
            _id: "5c1d91038ba76e6482e9afc9",
            email: "part3@part.com",
            name: "Moi Toi"
          }
        ],
        create_at: "2018-12-21T17:39:56.099Z",
        update_at: "2018-12-21T17:39:56.099Z",
        title: "le titre de Notre réunion",
        place: "Créteil 94000",
        note: "Réunion obligatoire",
        addComment: true,
        maxParticipant: 12,
        admin: {
          _id: "5c1d259015816d61753461c5",
          create_at: "2018-12-21T17:40:32.781Z",
          update_at: "2018-12-21T17:40:32.781Z",
          email: "el.m.konate@gmail.com",
          name: "Hadji"
        },
        __v: null
      }
    }
  };
*/
  
  api_url = 'http://localhost:8080/api/open/reunions/';
  reponse: Object;
  token: string;
  private sub: any;
  constructor(private http: HttpClient,private route: ActivatedRoute) {
  }

  getToken(): string{
    this.sub = this.route.params.subscribe(params => {
    this.token =params['token'];
  });
  console.log(this.token);
  return this.token;
  }

  
  getReunions(): void {
    this.api_url+=this.getToken();
    this.http.get(this.api_url).subscribe(data => {
      this.reponse = data;
      console.log(data);
    });

  }


  ngOnInit() {
    this.getReunions();
  }

}
