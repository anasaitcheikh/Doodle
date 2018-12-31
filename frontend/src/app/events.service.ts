import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

import {OpenEventResponse} from '../utils/types';

@Injectable()
export class EventsService {

  constructor(private http:HttpClient) {

  }

  events = [
     {
       date: "16 novembre 2018",
       email: "doumbiadoussou197@yahoo.fr",
       h_dep: "20h",
       h_fin: "23h",
       lieu: "Créteil",
       nbmax_part: 5,
       nom: "doussou",
       note: "middleware",
       titre: "reunion"
     },
     {
       date: "26 décembre 2018",
       email: "mid@upec.fr",
       h_dep: "20h",
       h_fin: "23h",
       lieu: "Paris",
       nbmax_part: 5,
       nom: "doussou",
       note: "notre projet",
       titre: "projet"
     },
     

   ];

  addEvent(event){
     this.events.push(event);
     console.log("try call API");
    const req = this.http.post('http://localhost:8080/api/open/reunions/',
      {
        data:event
      })
      return req;
  }

  getAllEvents(){
     return this.events;
  }

  getCloseEvent(eventId, token){
    const req = this.http.get(`http://localhost:8080/api/close/reunions/${eventId}/${token}`)
    return req;
  }

  updateCloseEvent(eventId, event, token){
    const req = this.http.put(`http://localhost:8080/api/close/reunions/${eventId}`, {
      data: {
        reunion: event,
        token: token
      }
    })
    return req;
  }

  deleteCloseEvent(eventId, token){
    const req = this.http.delete(`http://localhost:8080/api/close/reunions/${eventId}/${token}`)
    return req;
  }

  // OPEN event

  getOpenEvent(token){
    const req = this.http.get(`http://localhost:8080/api/open/reunions/${token}`)
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

  leaveCloseEvent(idReunion,idParticipant,token){
    const req = this.http.delete(`http://localhost:8080/api/close/reunions/${idReunion}/participants/${idParticipant}/${token}`)

    return req;
  }
}
