import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import firebase from 'firebase/app'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: any;
  @Output() loginEvent = new EventEmitter();

  constructor(
    public auth: AuthService,
    private afs: AngularFirestore
  ) {
  }

  ngOnInit(): void {
  }

  get userVote(): number {
    return (this.auth.currentUserId in this.post.voters) ? this.post.voters[this.auth.currentUserId] : 0
  }

  replaceNewLinesWithBreaks(value: string) : string {
    if (typeof(value) == "string") {
      return value.replace(/\n/g, '<br>');
    } else {
      return value
    }
  }

  toggleVote(toggleVote: number): void {
    // Require login
    if (!this.auth.authenticated) {
      this.loginEvent.emit()
      return
    }

    if (this.post.id != null) {
      const oldVote: number = this.userVote
      const newVote: number = (oldVote != toggleVote) ? toggleVote : 0
      var data = {
        ["voters." + this.auth.currentUserId]: newVote, 
        votes: firebase.firestore.FieldValue.increment(newVote-oldVote)
      }
      this.afs.doc("MtrnPosts/" + this.post.id).update(data)  
    }
  }

  deleteMe(): void {
    if(confirm("Are you sure you want to delete this post? \nThis is not reversible")) {
      this.afs.doc("MtrnPosts/" + this.post.id).delete()
    }
  }

}
