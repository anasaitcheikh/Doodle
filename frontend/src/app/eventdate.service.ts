import { Injectable } from '@angular/core';
import { Date} from '../utils/types';

@Injectable()
export class EventdateService {

  constructor() { }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  isEventDateValid(date: Date) {
    const dateRegex = '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'
    if (date.date != null) {
      if (date.date.toString().match(dateRegex) && (new Date(date.date).getTime() > new Date().getTime())) {
        const hourRegex = '^([0-9]|0[0-9]|1[0-9]|2[0-3])h([0-5][0-9])?$'
        if (date.hourStart.match(hourRegex) && date.hourEnd.match(hourRegex)) {
          const sh = parseInt(date.hourStart.replace('h', ''))
          const eh = parseInt(date.hourEnd.replace('h', ''))
          return sh < eh
        }
      }
    }
    return false
  }
}
