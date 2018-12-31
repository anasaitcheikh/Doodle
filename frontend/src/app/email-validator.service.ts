import { Injectable } from '@angular/core';
import { validate } from "email-validator"

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {

  constructor() { }

  isEmailValid(email){
    return validate(email)
  }
}
