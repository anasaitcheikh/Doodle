import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
   events = [
       
    
   ];

  event = {
    data : {
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
    }
  };

  constructor(private eventService:EventsService) { 
     this.events = this.eventService.getAllEvents();

  }

  ngOnInit() {
  }

  onAddEvent(form){
     console.log(form.email);
     this.event.data.reunion.admin.email = form.email;
     this.event.data.reunion.admin.name = form.name;
     this.event.data.reunion.title = form.title;
     this.event.data.reunion.place = form.place;
     this.event.data.reunion.note = form.note;
     this.event.data.reunion.date.push({date:form.date,hourStart:form.hourStart,hourEnd:form.hourEnd});
     this.event.data.reunion.addComment = true;
     this.event.data.reunion.maxParticipant = form.maxParticipant;
     console.log(this.event);
     this.eventService.addEvent(this.event);
     this.events = this.eventService.getAllEvents();
  }

}
