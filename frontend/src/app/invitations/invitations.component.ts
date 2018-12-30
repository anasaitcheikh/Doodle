import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})



export class InvitationsComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  guestReunions = this.userData.reunions.guest;
  //ownerReunions = this.userData.reunions.owner;
  currentReunion = null;
  displayedColumns: string[] = ['checked','title', 'place', 'date'];
  dataSource = this.guestReunions;

  constructor() {

     //console.log(this.guestReunions);
    // console.log(this.guestReunions[0].date);
     console.log('data source');
     console.log(this.dataSource);
     console.log('lenght guest');
     console.log(this.guestReunions);
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
}




