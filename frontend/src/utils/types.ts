export interface Event {
  participants: [Participant?]
}

export interface Participant {
  name : string;
  email : string;
  id?: string
}
