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
    participants : Participant[]
  }
}

export interface User {
   name: string;
   email: string;
   password?: string;
   owner? : Event[];
   guest? : Event[];
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Date {
   date : string,
   hourStart : string,
   hourEnd : string
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
