import { Component, OnInit } from '@angular/core';

/*const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];*/

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})



export class InvitationsComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  guestReunions = this.userData.reunions.guest;
  ownerReunions = this.userData.reunions.owner;
  currentReunion = this.guestReunions[0];

  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['title', 'place', 'date'];
  dataSource = this.guestReunions;

  constructor() {
     console.log(this.guestReunions);
     console.log(this.guestReunions[0].date);
     console.log('data source');
     console.log(this.dataSource);
  }



  ngOnInit() {
  }
  selectRow(row){
    console.log("click on row");
    console.log(row);
    this.currentReunion = row;
  }
}




