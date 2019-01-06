import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { EmailValidatorService } from '../email-validator.service';
import { EventdateService } from '../eventdate.service';
import { Event, Date, Participant, OpenEventResponse, Comment } from '../../utils/types'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import 'rxjs/Rx';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit, OnDestroy {
  event: Event
  token
  currentParticipant
  isAdmin
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

  private canAddComment = false

  private _getEventSubscription
  private _updateEventSubscription
  private _deleteEventSubscription
  private _createDateSubscription
  private _deleteDateSubscription
  private _createParticipantSubscription
  private _updateParticipantSubscription
  private _deleteParticipantSubscription
  private _createCommentSubscription
  private _updateCommentSubscription
  private _deleteCommentSubscription
  private _deleteAdminSubscription

  constructor(private eventsService: EventsService,
    private emailValidatorService: EmailValidatorService,
    private eventdateService: EventdateService,
    private route: ActivatedRoute,
    private router: Router) {
      console.log('constructor')
  }

  async ngOnInit() {
    console.log('onInit')
    this.token = this.route.snapshot.paramMap.get('token');

    this.getEvent().subscribe(
      res => {
        this.resJson = JSON.parse(JSON.stringify(res))
        this.currentParticipant = this.resJson.data.participant;
        this.isAdmin = this.resJson.data.participant.admin;
        this.event = this.resJson.data.reunion;
        this.canAddComment = this.resJson.data.reunion.addComment;
        console.log(this.currentParticipant)
        console.log('event', this.event)
      },
      error => console.log(error)
    )
  }

  ngOnDestroy(): void {
    console.log('destroy-component')
  }

  updateEvent() {
    const currentEvent = JSON.parse(JSON.stringify(this.event))
    if (currentEvent.title.length < 3) {
      this.errorMsg = "Le titre de la rencontre doit contenir au moins 3 caractères."
      return false
    }

    if(currentEvent.maxParticipant < 1){
      this.errorMsg = "La rencontre doit avoir au minimum un participant."
      return false
    }

    if(currentEvent.maxParticipant < this.resJson.data.reunion.participant.length){
      this.errorMsg = "Le nombre max de participant doit être supérieur ou égal au nombre de participant."
      return false
    }

    if (currentEvent.place.length < 3) {
      this.errorMsg = "Le lieu de la rencontre doit contenir au moins 3 caractères."
      return false
    }
    const event = {
      title: currentEvent.title,
      place: currentEvent.place,
      note: currentEvent.note,
      maxParticipant: currentEvent.maxParticipant,
      addComment: currentEvent.addComment,

    }

    this.eventsService.updateEvent(this.resJson.data.reunion._id, event, this.token)
      .subscribe(
        res => console.log('updateEvent', res)
      )
      .unsubscribe()
  }

  async deleteEvent() {
    this._deleteEventSubscription = this.eventsService.deleteOpenEvent(this.resJson.data.reunion._id, this.token)
      .subscribe(
        _ => this.router.navigate(['welcome']),
        error => console.log('error', error)
      )
  }

  createDate() {
    this.newDate.date = this.eventdateService.formatDate(this.newDate.date)
    if (!this.eventdateService.isEventDateValid(this.newDate)) {
      this.errorMsg = "Au moins une des dates n'est pas valide. Vérifez que la date est postérieure à la date actuelle et que l'heure de fin n'est pas antérieure à celle de début"
      this.hasError = true
      return
    }
    this.eventsService.createDate(this.resJson.data.reunion._id, this.newDate, this.token)
      .subscribe(
        res => {
          console.log('res', res);
          this.newDate = {
            date: '',
            hourStart: '',
            hourEnd: ''
          }
          this.router.navigate([`redirect/open-event--${this.token}`])
        },
        error => console.log('newDate', error)
      )
  }

  deleteDate(idDate) {
    this.eventsService.removeDate(this.resJson.data.reunion._id, idDate, this.token)
      .subscribe(
        res => this.router.navigate([`redirect/open-event--${this.token}`]),
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

    if ((this.newParticipant.email == this.resJson.data.reunion.admin.email)) {
      this.hasError = true
      this.errorMsg = "L'admin utilise déjà cet email."
      return
    }

    if (this.resJson.data.reunion.maxParticipant > this.resJson.data.reunion.participant.length) {
      this.eventsService.createParticipant(this.resJson.data.reunion._id, this.newParticipant, this.token)
        .subscribe(
          res => {
            console.log('create participant', res);
            this.newParticipant = {
              name: '',
              email: ''
            }
          },
          error => console.log('error', error)
        )
    }
    else {
      this.hasError = true
      this.errorMsg = "Le nombre maximal de participants est atteint."
    }
  }

  updateParticipant() {
    if (this.currentParticipant.name.length < 3) {
      this.hasError = true
      this.errorMsg = "Le nom du participant doit contenir au moins 3 caractères."
      return
    }

    const participant: Participant = {
      name: this.currentParticipant.name,
      email: this.currentParticipant.email
    }

    this.eventsService.updateOpenReunionParticipant(
      this.resJson.data.reunion._id,
      this.currentParticipant.idParticipant,
      participant,
      this.token
    )
      .subscribe(
        res => console.log('res', res),
        error => console.log('error', error)
      )
  }

  deleteParticipant(idParticipant) {
    this.eventsService.deleteParticipant(this.resJson.data.reunion._id, idParticipant, this.token)
      .subscribe(
        res => {
          if (this.isAdmin) {

          }
          else {
            this.router.navigate(['welcome'])
          }
        },
        error => console.log('errorDeleteParticipant', error)
      )
  }

  getEvent() {
    return this.eventsService.getOpenEvent(this.token)
  }

  createComment() {
    if (this.newCommentText.length < 2) {
      console.log('less than 2')
    }
    else {
      const comment: Comment = {
        name: this.currentParticipant.name,
        email: this.currentParticipant.email,
        text: this.newCommentText
      }

      this.eventsService.createComment(this.resJson.data.reunion._id, comment, this.token)
        .subscribe(
          res => {
            console.log('commentAdded', res);
            this.newCommentText = ''
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
      name: this.currentParticipant.name,
      email: this.currentParticipant.email
    }

    this.eventsService.updateComment(this.resJson.data.reunion._id, idComment, comment, this.token)
      .subscribe(
        res => console.log('updateComment', res)
      )
  }

  removeComment(idComment) {
    this.eventsService.removeComment(this.resJson.data.reunion._id, idComment, this.token)
      .subscribe(
        res => console.log('deleteComment', res)
      )
  }

  updateAdmin() {
    if(this.currentParticipant.name){
      this.hasError = true
      this.errorMsg = "Le nom de l'admin doit contenir au moins 3 caractères."
      return
    }
    this.eventsService.updateAdmin(this.resJson.data.reunion._id, this.currentParticipant.name, this.currentParticipant.email, this.token)
      .subscribe(
        res => {
          const token = JSON.parse(JSON.stringify(res)).data.token
          this.router.navigate([`open-event/${token}`])
        }
      )
  }
}


