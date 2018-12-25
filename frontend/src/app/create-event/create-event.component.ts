import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import {Date, Event, Participant} from '../../utils/types';


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
  addComment : boolean;
  event : Event;
  participants : [Participant?] = [];

  constructor(private eventService:EventsService) { 
     this.events = this.eventService.getAllEvents();

  }

  ngOnInit() {
  }

  onChangeAddComment(value:boolean){
     this.addComment = value;
  }

  addPartcipant(){
    this.participants.push({
      name:"",
      email:""
    })
  }

  onAddEvent(form){
     console.log(form.email);
     this.event = {
       reunion : {
         admin : {
           email : form.email,
           name :  form.name
         },
         title : form.title,
         place : form.place,
         note :  form.place,
         date : [
           { date : form.date,
             hourStart : form.hourStart,
             hourEnd : form.hourEnd }
         ],
         addComment : this.addComment,
         maxParticipant : form.maxParticipant,
         participants : this.participants
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
