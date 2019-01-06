import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service'
import { Event, Date, Participant } from '../../utils/types'
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {
  event: Event;
  event2: Event;
  reunionId: string;
  private sub : any;
  ownerReunions = [];
  currentReunion;
  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  
  constructor(private route: ActivatedRoute, private eventsService: EventsService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log(params);
      this.reunionId = params['id_event'];
    });
    this.ownerReunions = this.userData.reunions.owner;
    this.ownerReunions.forEach(reunion=>{
      if(reunion._id == this.reunionId){
        this.event2 = reunion;
      }
    });
    console.log("current reunion");
    console.log(this.event2);

    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    this.event = {
      reunion: {
        admin: {
          email: 'el.m.konate@gmail.com',
          name: 'El Hadji Maguette KONATE'
        },
        title: 'Projet Middleware',
        place: 'Université Paris Est Créteil',
        note: 'A deposer au plus tard le 8 Janvier 2018',
        date: [
          {
            date: '2019-01-08',
            hourStart: '9h',
            hourEnd: '18h'
          },
          {
            date: '2019-01-14',
            hourStart: '13h',
            hourEnd: '14h'
          }
        ],
        addComment: true,
        maxParticipant: 4,
        participant: [
          {
            name: 'Mohamed ADEGBINDIN',
            email: 'ade.moub@gmail.com'
          },
          {
            name: 'Rose DOUMBIA',
            email: 'rose@gmail.com'
          },
          {
            name: 'Anas AIT CHEIKH',
            email: 'anas@gmail.com'
          }
        ],
        comment: [
          {
            name: '',
            email: '',
            text: text
          },
          {
            name: '',
            email: '',
            text: text
          },
          {
            name: '',
            email: '',
            text: text
          }
        ]
      }
    }
  }

  updateEvent() {

  }

  deleteEvent() {

  }

  addDate() {
    const date: Date = {
      date: '',
      hourStart: '',
      hourEnd: ''
    }
    this.event.reunion.date.push(date)
  }

  deleteDate(date) {
    const index: number = this.event.reunion.date.indexOf(date);
    if (index !== -1) {
      this.event.reunion.date.splice(index, 1);
    }
  }

  addParticipant() {
    const participant: Participant = {
      name: '',
      email: ''
    }
    this.event.reunion.participant.push(participant)
  }

  deleteParticipant(participant) {
    const index: number = this.event.reunion.participant.indexOf(participant);
    if (index !== -1) {
      this.event.reunion.participant.splice(index, 1);
    }
  }
}
