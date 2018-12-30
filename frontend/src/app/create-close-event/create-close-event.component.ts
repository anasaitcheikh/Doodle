import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EventsService } from '../events.service';
import { Date, Close_Event, Participant } from '../../utils/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-close-event',
  templateUrl: './create-close-event.component.html',
  styleUrls: ['./create-close-event.component.css']
})
export class CreateCloseEventComponent implements OnInit {
  addComment: boolean = false;
  event: Close_Event;
  token: string;
  participants: Map<Number, Participant> = new Map();
  dates: Map<Number, Date> = new Map();
  maxParticipant = 0;

  constructor(private eventService: EventsService, private router: Router) {
  }

  ngOnInit() {
    const date = {
      date: "2018-12-12",
      hourStart: '9h',
      hourEnd: '18h'
    }
    this.dates.set(1, date);
  }

  onChangeAddComment(change) {
    this.addComment = change.checked
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
      date: '',
      hourStart: '',
      hourEnd: ''
    }
    const lastIndex = Array.from(this.dates.keys()).pop().valueOf();
    this.dates.set(lastIndex + 1, date);
  }

  removeParticipant(key) {
    this.participants.delete(key)
  }

  removeDate(key) {
    this.dates.delete(key)
  }

  onAddEvent(form) {
    this.event = {
      title: form.title,
      place: form.place,
      note: form.note,
      date: Array.from(this.dates.values()),
      addComment: this.addComment,
      maxParticipant: this.maxParticipant,
      participant: Array.from(this.participants.values()),
      comment: []

    }

    this.token = JSON.parse(localStorage.getItem('currentUser')).data.token;

    console.log('event', this.event);
    this.eventService.addCloseEvent(this.event, this.token)
      .subscribe(
        res => {
          this.router.navigate([`close-events`])
        }
      )
  }

}
