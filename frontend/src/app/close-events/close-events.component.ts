import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Event} from '../../utils/types';
import { Router } from '@angular/router';
import { EventsService } from '../events.service'

@Component({
  selector: 'app-close-events',
  templateUrl: './close-events.component.html',
  styleUrls: ['./close-events.component.css']
})

export class CloseEventsComponent implements OnInit {
  ownerReunions
  displayedColumns: string[] = ['title', 'place', 'date', 'numberOfParticipants', 'numberOfComments', 'actions']
  dataSource
  searchText = '';
  filteredEvents: MatTableDataSource<Event>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private eventsService: EventsService) { }

  async ngOnInit() {
    this.getEvent()
    .subscribe(
      res => {
        this.dataSource = JSON.parse(JSON.stringify(res)).data.reunions.owner
        this.filteredEvents = new MatTableDataSource(this.dataSource);
        this.filteredEvents.sort = this.sort;
      },
      error => console.log('error', error)
    )
  }

  handleSearchEnterPress($event): void {
    $event.target.blur();
  }

  filterEvents(): void {
    this.filteredEvents = new MatTableDataSource(
      this.dataSource.filter(
        (line) =>
          line.title.toString().toUpperCase().includes(this.searchText.toUpperCase()) ||
          line.place.toString().toUpperCase().includes(this.searchText.toUpperCase()),
      ),
    );
    this.filteredEvents.sort = this.sort;
  }

  showEvent(eventId){
    this.router.navigate(['show-event/',eventId]);
  }

  deleteEvent(eventId){
    console.log('delete')
    this.eventsService.deleteCloseEvent(eventId, JSON.parse(localStorage.getItem('currentUser')).data.token)
    .subscribe(
      res => this.router.navigate(['redirect/close-events']) ,
      error => console.log('error', error)
    )
  }

  getEvent(){
    return this.eventsService.getCloseEvents('own', JSON.parse(localStorage.getItem('currentUser')).data.token)
  }
}
