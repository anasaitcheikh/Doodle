import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {EventsService} from "../events.service";
import {Comment} from "../../utils/types";

@Component({
  selector: 'app-comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.css']
})
export class CommentsDetailsComponent implements OnInit {

   reunionId: string;
   private sub : any;
   comments : [];
   newCommentText : string;
   guestReunions = [];
   userToken :string;
   userData = JSON.parse(localStorage.getItem('currentUser')).data;
   hasError : boolean;
   errorMsg : string;


  constructor(private route: ActivatedRoute, private eventsService: EventsService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log(params);
      this.reunionId = params['id_event'];
    });
    this.userToken = this.userData.token;
    console.log('id reunion');
    console.log(this.reunionId);
    this.guestReunions = this.userData.reunions.guest;
    this.guestReunions.forEach(reunion=>{
       if(reunion._id == this.reunionId){
         this.comments = reunion.comment;
       }
    });
    console.log("comments");
    console.log(this.comments);
  }

  createComment(){
    if (this.newCommentText.length < 2) {
      this.hasError = true
      this.errorMsg = "Le commentaire doit contenir au moins 2 caractères."
      return
    }
      const comment: Comment = {
        name: this.userData.user.name,
        email: this.userData.user.email,
        text: this.newCommentText
      }
      console.log('new comment');
      console.log(this.newCommentText);
      console.log(this.userToken);
      this.sub = this.eventsService.createCloseComment(this.reunionId, comment, this.userToken)
        .subscribe(
          res => {
            console.log('redirect')
          } ,
          error => console.log('commentAdded', error)
        )

  }

  updateComment(commentId, commentText){
    if (commentText.length < 2) {
      this.hasError = true
      this.errorMsg = "Le commentaire doit contenir au moins 2 caractères."
      return
    }
    const comment: Comment = {
      _id: commentId,
      text: commentText,
      name: this.userData.user.name,
      email: this.userData.user.email
    }

    this.sub = this.eventsService.updateCloseComment(this.reunionId, commentId, comment, this.userToken)
      .subscribe(
        res => console.log('updateComment', res)
      )
}
  removeComment(commentId){
    this.sub = this.eventsService.removeCloseComment(this.reunionId, commentId, this.userToken)
      .subscribe(
        res => console.log('deleteComment', res)
      )
}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
