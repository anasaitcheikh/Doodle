import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { EmailValidatorService } from '../email-validator.service';
import { Event, Date, Participant, OpenEventResponse, Comment } from '../../utils/types'
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';

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
  resJson
  newCommentText = ''
  newParticipant: Participant = {
    name: '',
    email: ''
  }
  hasError = false
  errorMsg

  constructor(private eventsService: EventsService, private emailValidatorService: EmailValidatorService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');

    this.getEvent().subscribe(
      res => {
        this.resJson = JSON.parse(JSON.stringify(res))
        this.currentParticipant = this.resJson.data.participant;
        this.isAdmin = this.resJson.data.participant.admin;
        this.event = this.resJson.data.reunion;
        console.log(this.currentParticipant)
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
      if(p.email == this.newParticipant.email){
        this.hasError = true
        this.errorMsg = "Un participant utilise déjà cet email."
        test = false
        return
      }
    })

    if(!test){
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
          res => console.log('create participant', res)
        )
    }
    else {
      this.hasError = true
      this.errorMsg = "Le nombre maximal de participants est atteint."
    }
  }

  updateParticipant() {
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
        res => console.log('mod', res)
      )
  }

  deleteParticipant(idParticipant) {
    this.eventsService.deleteParticipant(this.resJson.data.reunion._id, idParticipant, this.token)
      .subscribe(
        res => console.log('deleteParticipant', res)
      )
  }

  getEvent() {
    return this.eventsService.getOpenEvent(this.token)
  }

  createComment() {
    if (this.newCommentText.length < 3) {
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
          res => console.log('commentAdded', res)
        )
    }
  }

  updateComment(idComment, commentText) {
    if (commentText.length < 2) {
      this.hasError = true
      this.errorMsg = "Le commentaire doit contenir au moins deux caractères."
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
}


