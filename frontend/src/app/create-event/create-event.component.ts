import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EventsService } from '../events.service';
import { Date, Event, Participant } from '../../utils/types';
import { Router } from '@angular/router';
import { EmailValidatorService } from '../email-validator.service';
import { EventdateService } from '../eventdate.service';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  addComment: boolean = false;
  event: Event;
  participants: Map<Number, Participant> = new Map();
  dates: Map<Number, Date> = new Map();
  maxParticipant = 1;
  hasError = false;
  errorMsg;

  constructor(private eventService: EventsService, 
    private router: Router, 
    private emailValidatorService: EmailValidatorService,
    private eventdateService: EventdateService) {
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

  maxParticipantChange(value) {
    if(this.participants.size > this.maxParticipant){
      this.participants.clear()
    }
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
      date.date = this.eventdateService.formatDate(date.date)
      if (this.eventdateService.isEventDateValid(date)) {
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

    console.log(dates)

    this.event = {
      reunion: {
        admin: {
          email: form.adminEmail,
          name: form.adminName
        },
        title: form.title,
        place: form.place,
        note: form.note,
        date: dates,
        addComment: this.addComment,
        maxParticipant: this.maxParticipant,
        participant: Array.from(this.participants.values()),
        comment: []
      }
    }

    console.log('event', this.event);
    this.eventService.addEvent(this.event)
      .subscribe(
        res => {
          const token = JSON.parse(JSON.stringify(res)).data.token
          this.router.navigate([`open-event/${token}`])
        }
      )
  }

  private checkData(form, dates: Date[]) {
    if (form.adminName.length < 3) {
      this.errorMsg = "Le nom de l'admin doit contenir au moins 3 caractères."
      return false
    }

    if (!this.emailValidatorService.isEmailValid(form.adminEmail)) {
      this.errorMsg = "L'email de l'admin est invalide."
      return false
    }

    if (form.title.length < 3) {
      this.errorMsg = "Le titre de la rencontre doit contenir au moins 3 caractères."
      return false
    }

    if(this.maxParticipant < 1){
      this.errorMsg = "La rencontre doit avoir au minimum un participant."
      return false
    }

    if (form.place.length < 3) {
      this.errorMsg = "Le lieu de la rencontre doit contenir au moins 3 caractères."
      return false
    }

    let datesValid = true
    dates.forEach(date => {
      date.date = this.eventdateService.formatDate(date.date)
      if (!this.eventdateService.isEventDateValid(date)) {
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
        if(participant.name.length < 3){
          this.errorMsg = "Le nom d'un participant doit contenir au moins 3 caractères."
          participantValid= false
          return
        }
        if(!this.emailValidatorService.isEmailValid(participant.email)){
          this.errorMsg = "L'email d'au moins un participant n'est pas valide"
          participantValid= false
          return
        }
        if(participant.email == form.adminEmail){
          this.errorMsg = "Un particpant ne peut pas avoir le même email que l'admin"
          participantValid= false
          return 
        }
      }
    )
    if(this.participants.size > new Set(Array.from(this.participants.values())).size){
      this.errorMsg = "La liste des particpants contient des doublons d'email."
      participantValid= false
      return
    }

    if(!participantValid){
      return false
    }

    return true
  }
}
