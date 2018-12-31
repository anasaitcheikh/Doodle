import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EventsService } from '../events.service';
import { Date, Close_Event, Participant } from '../../utils/types';
import { Router } from '@angular/router';
import { EmailValidatorService } from '../email-validator.service';


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
  hasError = false;
  errorMsg;

  constructor(private eventService: EventsService, private router: Router, private emailValidatorService: EmailValidatorService) {
  }

  ngOnInit() {
    const date = {
      date: '',
      hourStart: '',
      hourEnd: ''
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
    this.hasError = false
    let dates = Array.from(this.dates.values())

    dates.forEach(date => {
      date.date = this.formatDate(date.date)
      if (this.isEventDateValid(date)) {
        return date
      }
      else {
        return
      }
    })

    if (!this.checkData(form, dates)) {
      this.hasError = true;
      return
    }
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
        res => this.router.navigate([`close-events`]),
      )
  }


  private checkData(form, dates: Date[]) {
    if (form.title.length < 3) {
      this.errorMsg = "Le titre de la rencontre doit contenir au moins 3 caractères."
      return false
    }

    if (this.maxParticipant < 1) {
      this.errorMsg = "La rencontre doit avoir au minimum un participant."
      return false
    }

    if (form.place.length < 3) {
      this.errorMsg = "Le lieu de la rencontre doit contenir au moins 3 caractères."
      return false
    }

    let datesValid = true
    dates.forEach(date => {
      date.date = this.formatDate(date.date)
      if (!this.isEventDateValid(date)) {
        datesValid = false
        return
      }
    })

    if (!datesValid) {
      this.errorMsg = "Au moins une des dates n'est pas valide. Vérifez que la date est postérieure à la date actuelle et que l'heure de fin n'est pas antérieure à celle de début"
      return false
    }


    let participantValid = true
    this.participants.forEach(
      participant => {
        if (participant.name.length < 3) {
          this.errorMsg = "Le nom d'un participant doit contenir au moins 3 caractères."
          participantValid = false
          return
        }
        if (!this.emailValidatorService.isEmailValid(participant.email)) {
          this.errorMsg = "L'email d'au moins un participant n'est pas valide"
          participantValid = false
          return
        }
        if (participant.email == form.adminEmail) {
          this.errorMsg = "Un particpant ne peut pas avoir le même email que l'admin"
          participantValid = false
          return
        }
      }
    )
    if (this.participants.size > new Set(Array.from(this.participants.values())).size) {
      this.errorMsg = "La liste des particpants contient des doublons d'email."
      participantValid = false
      return
    }

    if (!participantValid) {
      return false
    }

    return true
  }

  private formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  isEventDateValid(date: Date) {
    const dateRegex = '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'
    if (date.date != null) {
      if (date.date.toString().match(dateRegex) && (new Date(date.date).getTime() > new Date().getTime())) {
        const hourRegex = '^([0-9]|0[0-9]|1[0-9]|2[0-3])h([0-5][0-9])?$'
        if (date.hourStart.match(hourRegex) && date.hourEnd.match(hourRegex)) {
          const sh = parseInt(date.hourStart.replace('h', ''))
          const eh = parseInt(date.hourEnd.replace('h', ''))
          return sh < eh
        }
      }
    }
    return false
  }

}

