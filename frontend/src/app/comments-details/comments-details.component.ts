import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.css']
})
export class CommentsDetailsComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  comments = this.userData.reunions.guest[0].comment;
  displayedColumns: string[] = ['checked','title', 'place', 'date'];
  dataSource = this.comments;
  constructor() {

    console.log('comments');
    console.log(this.userData);
    console.log(this.dataSource);
  }

  ngOnInit() {
  }

}
