import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.css']
})
export class CommentsDetailsComponent implements OnInit {

   id: number;
   private sub : any;
  userData = JSON.parse(localStorage.getItem('currentUser')).data;
  comments = this.userData.reunions.guest[0].comment;
  displayedColumns: string[] = ['checked','title', 'place', 'date'];
  dataSource = this.comments;
  constructor(private route: ActivatedRoute) {

    console.log('comments');
    console.log(this.userData);
    console.log(this.dataSource);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
