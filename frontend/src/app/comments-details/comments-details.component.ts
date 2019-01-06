import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {EventsService} from "../events.service";
import {Comment} from "../../utils/types";
import {RedirectionService} from "../redirection.service"
import {Router} from "@angular/router";

@Component({
  selector: 'app-comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.css']
})
export class CommentsDetailsComponent implements OnInit {

   reunionId: string;
   private sub = null;
   comments : [];
   newCommentText : string;
   guestReunions = [];
   userToken :string;
   userData = JSON.parse(localStorage.getItem('currentUser')).data;
   hasError : boolean;
   errorMsg : string;
   currentReunion ;

  constructor(private route: ActivatedRoute, private eventsService: EventsService,private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.reunionId = params['id_event'];
    });
    this.userToken = this.userData.token;
    console.log('id reunion');
    console.log(this.reunionId);
    this.guestReunions = this.userData.reunions.guest;
    this.guestReunions.forEach(reunion=>{
       if(reunion._id == this.reunionId){
         this.comments = reunion.comment;
         this.currentReunion = reunion;
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
    let index = this.userData.reunions.guest.indexOf(this.currentReunion);
      const comment: Comment = {
        name: this.userData.user.name,
        email: this.userData.user.email,
        text: this.newCommentText
      }

      this.sub = this.eventsService.createCloseComment(this.reunionId, comment, this.userToken)
        .subscribe(
          res => {
            console.log('new comment added!');
            console.log(res);
            console.log('redirect')
           // this.currentReunion.comment.push(comment);
          //  if(index ! = -1){
            //  this.userData.reunions.guest[index] = this.currentReunion;
           // }
           // localStorage.setItem('currentUser', JSON.stringify({data: this.userData}));
            this.router.navigate([`redirect/comments-details--${this.reunionId}`])
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
    let index = this.userData.reunions.guest.indexOf(this.currentReunion);
    const comment: Comment = {
      _id: commentId,
      text: commentText,
      name: this.userData.user.name,
      email: this.userData.user.email
    }

    this.sub = this.eventsService.updateCloseComment(this.reunionId, commentId, comment, this.userToken)
      .subscribe(
        res => {
          console.log('updateComment', res);
          console.log('comments before update');
          console.log(this.currentReunion.comment);
          this.currentReunion.comment.forEach(c=>{
           if(c._id == commentId){
            this.currentReunion.comment[this.currentReunion.comment.indexOf(c)] = comment;
            }
          })
          console.log('comments after update');
          console.log(this.currentReunion.comment);
          if(index ! = -1){
            this.userData.reunions.guest[index] = this.currentReunion;
          }
          localStorage.setItem('currentUser', JSON.stringify({data: this.userData}));

          this.router.navigate([`redirect/comments-details--${this.reunionId}`])
        }
      )
}
  removeComment(commentId){
    let index = this.userData.reunions.guest.indexOf(this.currentReunion);
    this.sub = this.eventsService.removeCloseComment(this.reunionId, commentId, this.userToken)
      .subscribe(
        res => {
          console.log('deleteComment', res);
          //console.log('comments before remove');
          //console.log(this.currentReunion.comment);
           this.currentReunion.comment.forEach(c=>{
            if(c._id == commentId){
              this.currentReunion.comment.splice(this.currentReunion.comment.indexOf(c),1);
            }
          })
          //console.log('comments after remove');
         // console.log(this.currentReunion.comment);
          if(index ! = -1){
            this.userData.reunions.guest[index] = this.currentReunion;
          }
          localStorage.setItem('currentUser', JSON.stringify({data: this.userData}));
          this.router.navigate([`redirect/comments-details--${this.reunionId}`])
        }
      )
}

  ngOnDestroy() {
    if(this.sub ! = undefined && this.sub != null)
      this.sub.unsubscribe();
  }
}
