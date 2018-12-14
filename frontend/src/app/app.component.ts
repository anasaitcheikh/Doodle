import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Doodle';
  doodle = {
    titre:"ff"
  }

  ngOnInit(){

  }

  EventTitle = {
      title: ""
  }

  addEvent(){
     console.log("new event title: "+ this.EventTitle.title);
     this.EventTitle.title = '';
  }
}
