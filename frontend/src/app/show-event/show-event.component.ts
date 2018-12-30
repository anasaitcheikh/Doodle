import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service'
import { Event, Date, Participant } from '../../utils/types'

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {
  event: Event
  
  constructor(private eventsService: EventsService) { }

  ngOnInit() {
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
