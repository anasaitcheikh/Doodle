import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Event, User, Date } from '../../utils/types';
import { Router } from '@angular/router';


const ELEMENT_DATA: Event[] = [
  {
    reunion: {
      admin: {
        email: 'el@mail.com',
        name: 'hadji'
      },
      title: 'test',
      place: 'Paris',
      note: 'Note',
      date: [
        {
          date: '2018-12-12',
          hourStart: '9h',
          hourEnd: '19h'
        }
      ],
      addComment: true,
      maxParticipant: 5,
      participant: [],
      comment: []
    }
  },
  {
    reunion: {
      admin: {
        email: 'azertyu@mail.com',
        name: 'hadji'
      },
      title: 'test',
      place: 'Paris',
      note: 'Note',
      date: [
        {
          date: '2018-12-12',
          hourStart: '9h',
          hourEnd: '19h'
        }
      ],
      addComment: true,
      maxParticipant: 5,
      participant: [],
      comment: []
    }
  }
];

@Component({
  selector: 'app-close-events',
  templateUrl: './close-events.component.html',
  styleUrls: ['./close-events.component.css']
})

export class CloseEventsComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  ownerReunions = this.userData.reunions.owner;
  displayedColumns: string[] = ['title', 'place', 'numberOfParticipants', 'date']
  //dataSource = ELEMENT_DATA;
  dataSource = this.ownerReunions;
  searchText = '';
  filteredEvents: MatTableDataSource<Event>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router) { }

  ngOnInit() {
    this.filteredEvents = new MatTableDataSource(this.dataSource);
    this.filteredEvents.sort = this.sort;
  }

  handleSearchEnterPress($event): void {
    $event.target.blur();
  }

  filterEvents(): void {
    this.filteredEvents = new MatTableDataSource(
      this.dataSource.filter(
        (line) =>
        line.reunion.title.toString().toUpperCase().includes(this.searchText.toUpperCase()) ||
          line.reunion.admin.name.toString().toUpperCase().includes(this.searchText.toUpperCase()) ||
          line.reunion.admin.email.toUpperCase().toUpperCase().includes(this.searchText.toUpperCase()),
      ),
    );
    this.filteredEvents.sort = this.sort;
  }

  showEvent(elem){
    this.router.navigate(['show-event/hoho'])
  }
}
