import { Component, OnInit, Input } from '@angular/core';

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

  vote: number = 0;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore) {

  }

  ngOnInit(): void {
    this.vote = this.post.voters[this.auth.currentUserId]
  }

  toggleVote(toggleVote: number) {
    const oldVote: number = this.vote
    const newVote: number = (oldVote != toggleVote) ? toggleVote : 0
    console.log(oldVote, toggleVote, newVote)
    this.vote = newVote
    const votersId: string = "voters." + this.auth.currentUserId
    // var data = {(votersId), newVote}
    this.afs.doc("MtrnPosts/" + this.post.id).update({[votersId]: newVote, votes:  firebase.firestore.FieldValue.increment(newVote-oldVote)})
  }

}
