import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

interface Reunion {
  data: {
    reunion: {
      _id: any;
      date: any[];
      comment: any[];
      participant: any[];
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

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  events = [];
  isDataAvailable: boolean = false;
  api_url: string = 'http://localhost:8080/api/open/reunions/';
  reponse: Reunion;
  sub: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  generateUrl(): boolean {
    let token: string;
    this.sub = this.route.params.subscribe(params => {
      token = params['token'];
    });
    console.log(token);
    if (token != "") {
      this.api_url += token;
      return true;
    }
    else
      return false;
  }


  getReunions(): Promise<Reunion> {
    if (this.generateUrl()) {
      let tmp = this.http.get<Reunion>(this.api_url);
      tmp.subscribe(data => {
        this.reponse = data;
        console.log(data);
      });
      return tmp.toPromise();
    }
  }


  ngOnInit() {
    this.getReunions().then(() =>
      this.isDataAvailable = true); // Now has value;
  }
  //this.isDataAvailable = true;
}


