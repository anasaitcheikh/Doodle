import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Event, Date, Participant, OpenEventResponse } from '../../utils/types'
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  event: Event
  token
  currentParticipant
  isAdmin

  constructor(private eventsService: EventsService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    
    this.getEvent().subscribe(
      res => {
        const resJson  = JSON.parse(JSON.stringify(res))
        this.currentParticipant = resJson.data.participant;
        this.isAdmin = resJson.data.participant.admin;
        this.event = resJson.data.reunion;
        console.log(this.event)
      },
      error => console.log(error)
    )
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

  updateParticipant(){
    //this.eventsService.updateOpenReunionParticipant(this.event.reunion._id, this.token)
  }

  deleteParticipant(participant) {
    const index: number = this.event.reunion.participant.indexOf(participant);
    if (index !== -1) {
      this.event.reunion.participant.splice(index, 1);
    }
  }

  getEvent() {
    return this.eventsService.getOpenEvent(this.token)
  }
}


