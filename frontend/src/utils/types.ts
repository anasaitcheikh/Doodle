export interface OpenEventResponse {
  data: {
    participant: {
      admin: boolean,
      email: string,
      idReunion: string,
      name: string
    },
    reunion: Event
  }
}
export interface Event{
  reunion : {
    admin : {
      email : string,
      name : string
    },
    title : string,
    place : string,
    note : string,
    date : Date[],
    addComment : boolean,
    maxParticipant : number,
    participant : Participant[],
    comment: Comment[],
    update_at?: string,
    _id?: string
  }
}

export interface Close_Event{
    title : string,
    place : string,
    note : string,
    date : Date[],
    addComment : boolean,
    maxParticipant : number,
    participant : Participant[],
    comment: Comment[],
    update_at?: string,
    _id?: string
}

export interface User {
   name: string;
   email: string;
   password?: string;
   owner? : Event[];
   guest? : Event[];
}

export interface Participant {
  name : string;
  email : string;
  id?: string
}

export interface Date {
  date: string;
  hourStart: string;
  hourEnd: string
}

export interface User {
  name : string,
  email : string,
  id?: string,
  password?: string
}

export interface Comment {
  name : string,
  email : string,
  text?: string,
  _id?: string
}
