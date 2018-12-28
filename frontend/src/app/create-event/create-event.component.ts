import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Date, Event, Participant } from '../../utils/types';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  events = [];

  /* event =  {
      reunion : {
       admin : {
          email : "",
          name : ""
       },
       title : "",
       place : "",
       note : "",
       date : [],
       addComment : true,
       maxParticipant : 1,
       participants : []
       }
     };*/
  addComment: boolean;
  event: Event;
  participants: Map<Number, Participant>;
  dates: Map<Number, Date>;
  maxParticipant = 0;

  constructor(private eventService: EventsService) {
    this.events = this.eventService.getAllEvents();
  }

  ngOnInit() {
    this.participants = new Map();
    this.dates = new Map();
    const date = {
      date: "2018-12-12",
      hourStart: '9h',
      hourEnd: '18h'
    }
    this.dates.set(1, date);
    console.log(JSON.stringify(this.dates.get(1).date))
  }

  onChangeAddComment(value: boolean) {
    this.addComment = value;
    console.log("change add comment");
    console.log(this.addComment);
  }

  addParticipant() {
    let lastIndex = 0;
    if (this.participants.size > 0) {
      lastIndex = Array.from(this.participants.keys()).pop().valueOf();
    }
    const participant: Participant = {
      name: '',
      email: ''
    }
    this.participants.set(lastIndex + 1, participant);
  }

  addDate() {
    const date = {
      date: "2018-12-12",
      hourStart: '9h',
      hourEnd: '18h'
    }
    const lastIndex = Array.from(this.dates.keys()).pop().valueOf();
    this.dates.set(lastIndex + 1, date);
  }

  removeParticipant(index) {
    this.participants.delete(index);
  }

  removeDate(index) {
    this.dates.delete(index);
  }

  onAddEvent(form) {
    console.log(form.email);
    this.event = {
      reunion: {
        admin: {
          email: form.adminEmail,
          name: form.adminName
        },
        title: form.title,
        place: form.place,
        note: form.note,
        date: Array.from(this.dates.values()),
        addComment: this.addComment,
        maxParticipant: this.maxParticipant,
        participants: Array.from(this.participants.values())
      }
    }


    /*this.event.reunion.admin.email = form.email;
    this.event.reunion.admin.name = form.name;
    this.event.reunion.title = form.title;
    this.event.reunion.place = form.place;
    this.event.reunion.note = form.note;
    this.event.reunion.date.push({date:form.date,hourStart:form.hourStart,hourEnd:form.hourEnd});
    this.event.reunion.addComment = this.addComment;
    this.event.reunion.maxParticipant = form.maxParticipant;
    this.event.reunion.participants = this.participants;*/
    console.log(this.event);
    this.eventService.addEvent(this.event);
    this.events = this.eventService.getAllEvents();
  }

}
