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
  userEmail = this.userData.user.email;
  userToken = this.userData.token;
  currentReunion = null;
  reunionIdList : string[] = [];
  displayedColumns: string[] = ['select','title', 'place', 'date'];
  dataSource = this.guestReunions;
  selection = new SelectionModel(true, []);
  participantToReunion = [];

  constructor(private eventService: EventsService) {
     console.log('user email');
     console.log(this.userEmail);
     console.log('data source');
     console.log(this.dataSource);
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
    this.selection.selected.forEach(row => {
        this.reunionIdList.push(row._id);
        console.log("participant");
        console.log(row.participant);
        row.participant.forEach(p=>{
            if(p.email == this.userEmail){
                 this.participantToReunion.push({pId: p._id, rId: row._id})
            }
        })
      }
    );
    console.log(this.participantToReunion);

    //delete data from database
    this.participantToReunion.forEach(reunion =>{
       this.eventService.deleteCloseParticipant(reunion.rId, reunion.pId, this.userToken).subscribe(
          res =>{
            console.log(res);

           },
         error =>{
            console.log(error);
       })
    })
    //window.location.reload();

    //delete data from data source in local
    this.selection.selected.forEach(row=>{
        const index : number = this.dataSource.indexOf(row);
        console.log('index');
        console.log(index);
        if(index!=-1){
          console.log(this.dataSource);
          this.dataSource.splice(index,1);
          console.log(this.dataSource);
        }
    })

  }

  confirmLeaveReunion(){
    console.log('confirm leave reunion');
    this.leaveReunion();
  }

}




