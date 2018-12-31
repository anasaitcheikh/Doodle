import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {EventsService} from "../events.service";


@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})



export class InvitationsComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  guestReunions = this.userData.reunions.guest;
  userId = this.userData.user.id;
  userToken = this.userData.token;
  currentReunion = null;
  reunionIdList : string[] = [];
  displayedColumns: string[] = ['select','title', 'place', 'date'];
  dataSource = this.guestReunions;
  selection = new SelectionModel(true, []);


  constructor(private eventService: EventsService) {
     console.log(this.userData);
     console.log('user id');
     console.log(this.userId);
     console.log('token');
     console.log(this.userToken);
     console.log('data source');
     console.log(this.dataSource);
     console.log('lenght guest');
     console.log(this.guestReunions.length);
  }



  ngOnInit() {
    if( this.guestReunions.length > 0){
      this.currentReunion = this.guestReunions[0];
    }
  }
  onChange(value:boolean){

}
  selectRow(row){
    console.log("click on row");
    console.log(row);
    this.currentReunion = row;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  leaveReunion(){
    console.log(this.selection.selected);
    this.reunionIdList = [];
    this.selection.selected.forEach(row => this.reunionIdList.push(row._id));
    console.log(this.reunionIdList);
    this.reunionIdList.forEach(idReunion =>{
       this.eventService.leaveCloseEvent(idReunion, this.userId, this.userToken).subscribe(
          res =>{
            console.log(res);
           },
         error =>{
            console.log(error);
       })
    })

  //  http://localhost:8080/api/close/reunions/5c27d94f98b5340b6001d582/participants/5c27e8d5d5c12545b0b97563
  }

  confirmLeaveReunion(){
    console.log('confirm leave reunion');
    //this.leaveReunion();
  }

}




