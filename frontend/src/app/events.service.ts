import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';


import {OpenEventResponse} from '../utils/types';


@Injectable()
export class EventsService {


  constructor(private http:HttpClient) {


  }



  addEvent(event) {
    console.log('event', event)
    console.log("try call API");
    const req = this.http.post('http://localhost:8080/api/open/reunions/',
      {
        data: event
      })
    return req;
  }

  addCloseEvent(event, token) {
    console.log("try call API");
    const req = this.http.post('http://localhost:8080/api/close/reunions/', {
      data: {
        reunion: event,
        token: token
      }
    })
    return req;
  }



  getCloseEvent(eventId, token) {
    const req = this.http.get(`http://localhost:8080/api/close/reunions/${eventId}/${token}`)
    return req;
  }

  updateCloseEvent(eventId, event, token) {
    const req = this.http.put(`http://localhost:8080/api/close/reunions/${eventId}`, {
      data: {
        reunion: event,
        token: token
      }
    })
    return req;
  }

  deleteCloseEvent(eventId, token) {
    const req = this.http.delete(`http://localhost:8080/api/close/reunions/${eventId}/${token}`)
    return req;
  }

  // OPEN event

  getOpenEvent(token) {
    const req = this.http.get(`http://localhost:8080/api/open/reunions/${token}`)
    return req;
  }

  createParticipant(idReunion, participant, token){
    const req = this.http.post(`http://localhost:8080/api/open/reunions/${idReunion}/participants`, {
      data: {
        token: token,
        participant: participant
      }
    })
    return req;
  }

  updateOpenReunionParticipant(idReunion, idParticipant, participant, token){
    const req = this.http.put(`http://localhost:8080/api/open/reunions/${idReunion}/participants/${idParticipant}`, {
      data: {
        token: token,
        participant: participant
      }
    })
    return req;
  }


  deleteParticipant(idReunion, idParticipant, token){
    const req = this.http.delete(`http://localhost:8080/api/open/reunions/${idReunion}/participants/${idParticipant}/${token}`)
    return req;
  }

  deleteCloseParticipant(idReunion, idParticipant, token){
    console.log("call deleteCloseParticipant");
    console.log("http://localhost:8080/api/close/reunions/"+idReunion+"/participants/"+idParticipant+"/"+token);
    const req = this.http.delete(`http://localhost:8080/api/close/reunions/${idReunion}/participants/${idParticipant}/${token}`);
    return req;
  }

  createComment(idReunion, comment, token){
    const req = this.http.post(`http://localhost:8080/api/open/reunions/${idReunion}/comments`, {
      data: {
        token: token,
        comment: comment
      }
    })
    return req;
  }

  updateComment(idReunion, idComment, comment, token){
    const req = this.http.put(`http://localhost:8080/api/open/reunions/${idReunion}/comments/${idComment}`, {
      data: {
        token: token,
        comment: comment
      }
    })
    return req;
  }

  removeComment(idReunion, idComment, token){
    const req = this.http.delete(`http://localhost:8080/api/open/reunions/${idReunion}/comments/${idComment}/${token}`)
    return req;
  }


}
