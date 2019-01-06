import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service'
import { Event, Date, Participant, Comment } from '../../utils/types'
import { ActivatedRoute, Router } from "@angular/router";
import { EmailValidatorService } from '../email-validator.service'
import { EventdateService } from '../eventdate.service'

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {
  event: Event;
  eventId: string;
  token
  resJson
  newCommentText = ''
  newParticipant: Participant = {
    name: '',
    email: ''
  }
  newDate: Date = {
    date: '',
    hourStart: '',
    hourEnd: ''
  }
  hasError = false
  errorMsg
  canAddComment
  currentUser = {
    id: '',
    name : '',
    email: ''
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private emailValidatorService: EmailValidatorService,
    private eventdateService: EventdateService) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id_event')
    this.token = JSON.parse(localStorage.getItem('currentUser')).data.token
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).data.user
    console.log('token', this.token)
    this.getEvent()
      .subscribe(
        res => {
            this.resJson = JSON.parse(JSON.stringify(res))
            this.event = JSON.parse(JSON.stringify(res)).data.reunion
            this.canAddComment = this.resJson.data.reunion.addComment
            console.log('event', this.event)
        },
        error => console.log(error)
      )
  }

  updateEvent() {
    const currentEvent = JSON.parse(JSON.stringify(this.event))
    const check = () => {
      if (currentEvent.title.length < 3) {
        this.errorMsg = "Le titre de la rencontre doit contenir au moins 3 caractères."
        return false
      }

      if (currentEvent.maxParticipant < 1) {
        this.errorMsg = "La rencontre doit avoir au minimum un participant."
        return false
      }

      if (currentEvent.maxParticipant < this.resJson.data.reunion.participant.length) {
        this.errorMsg = "Le nombre max de participant doit être supérieur ou égal au nombre de participant."
        return false
      }

      if (currentEvent.place.length < 3) {
        this.errorMsg = "Le lieu de la rencontre doit contenir au moins 3 caractères."
        return false
      }
      return true
    }

    if (!check()) {
      return
    }

    const event = {
      title: currentEvent.title,
      place: currentEvent.place,
      note: currentEvent.note,
      maxParticipant: currentEvent.maxParticipant,
      addComment: currentEvent.addComment
    }

    this.eventsService.updateCloseEvent(this.resJson.data.reunion._id, event, this.token)
      .subscribe(
        res => this.router.navigate([`redirect/show-event--${this.eventId}`]),
        error => console.log('error', error)
      )
  }

  deleteEvent() {
    this.eventsService.deleteOpenEvent(this.resJson.data.reunion._id, this.token)
      .subscribe(
        _ => this.router.navigate(['welcome']),
        error => console.log('error', error)
      )
  }

  createDate() {
    this.newDate.date = this.eventdateService.formatDate(this.newDate.date)
    if (!this.eventdateService.isEventDateValid(this.newDate)) {
      this.errorMsg = "Vérifez que la date est postérieure à la date actuelle et que l'heure de fin n'est pas antérieure à celle de début"
      this.hasError = true
      return
    }
    this.eventsService.createCloseDate(this.resJson.data.reunion._id, this.newDate, this.token)
      .subscribe(
        res => {
          console.log('res', res);
          this.newDate = {
            date: '',
            hourStart: '',
            hourEnd: ''
          }
          this.router.navigate([`redirect/show-event--${this.eventId}`])
        },
        error => console.log('newDate', error)
      )
  }

  deleteDate(idDate) {
    this.eventsService.removeCloseDate(this.resJson.data.reunion._id, idDate, this.token)
      .subscribe(
        res => this.router.navigate([`redirect/show-event--${this.eventId}`]),
        error => console.log('deleteDate-error', error)
      )
  }

  createParticipant() {
    if (this.newParticipant.name.length < 3) {
      this.hasError = true
      this.errorMsg = "Le nom du participant doit contenir au moins 3 caractères."
      return
    }

    if (!this.emailValidatorService.isEmailValid(this.newParticipant.email)) {
      this.hasError = true
      this.errorMsg = "L'email du participant n'est pas valide."
      return
    }

    const participants: Participant[] = this.resJson.data.reunion.participant

    let test = true
    participants.forEach(p => {
      if (p.email == this.newParticipant.email) {
        this.hasError = true
        this.errorMsg = "Un participant utilise déjà cet email."
        test = false
        return
      }
    })

    if (!test) {
      return
    }

    if ((this.newParticipant.email == this.currentUser.email)) {
      this.hasError = true
      this.errorMsg = "L'admin utilise déjà cet email."
      return
    }

    if (this.resJson.data.reunion.maxParticipant > this.resJson.data.reunion.participant.length) {
      this.eventsService.createCloseParticipant(this.resJson.data.reunion._id, this.newParticipant, this.token)
        .subscribe(
          res => {
            console.log('create participant', res)
            console.log('redirectTo', `redirect/show-event--${this.eventId}`)
            this.router.navigate([`redirect/show-event--${this.eventId}`])
          },
          error => console.log('error', error)
        )
    }
    else {
      this.hasError = true
      this.errorMsg = "Le nombre maximal de participants est atteint."
    }
  }

  deleteParticipant(idParticipant) {
    this.eventsService.deleteCloseParticipant(this.resJson.data.reunion._id, idParticipant, this.token)
      .subscribe(
        res => {
            this.router.navigate([`redirect/show-event--${this.eventId}`])
        },
        error => console.log('errorDeleteParticipant', error)
      )
  }

  getEvent() {
    return this.eventsService.getCloseEvent(this.eventId, this.token)
  }

  createComment() {
    if (this.newCommentText.length < 2) {
      console.log('less than 2')
    }
    else {
      const comment: Comment = {
        name: this.currentUser.name,
        email: this.currentUser.email,
        text: this.newCommentText
      }

      this.eventsService.createCloseComment(this.resJson.data.reunion._id, comment, this.token)
        .subscribe(
          res => {
            console.log('commentAdded', res);
            this.newCommentText = ''
            this.router.navigate([`redirect/show-event--${this.eventId}`])
          },
          error => console.log('error', error)
        )
    }
  }

  updateComment(idComment, commentText) {
    if (commentText.length < 2) {
      this.hasError = true
      this.errorMsg = "Le commentaire doit contenir au moins 2 caractères."
      return
    }
    const comment: Comment = {
      _id: idComment,
      text: commentText,
      name: this.currentUser.name,
      email: this.currentUser.email
    }

    this.eventsService.updateCloseComment(this.resJson.data.reunion._id, idComment, comment, this.token)
      .subscribe(
        res => this.router.navigate([`redirect/show-event--${this.eventId}`]),
        error => console.log('error', error)
      )
  }

  removeComment(idComment) {
    this.eventsService.removeCloseComment(this.resJson.data.reunion._id, idComment, this.token)
      .subscribe(
        res => this.router.navigate([`redirect/show-event--${this.eventId}`]),
        error => console.log('error', error)
      )
  }
}
