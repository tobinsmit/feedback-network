import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import firebase from 'firebase/app';

import { Observable, of } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { Post } from '../post.model'
import { AuthService } from '../services/auth.service';
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component'
import { NewPostData } from '../new-post-dialog/new-post-data.model'

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  @Input() reloadEvent: any;
  @Output() loginEvent = new EventEmitter();

  posts: Post[] = [];
  lastPostsSnapshot: any;
  needToResortPosts = false;
  orderBy: 'Most Votes' | 'Newest' | 'Oldest' = 'Most Votes';

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {
    // // this.posts$ = this.afs.collection('MtrnPosts', ref => ref.orderBy('votes','desc').limit(1000)).valueChanges()
    // this.posts$ = this.afs.collection('MtrnPosts').snapshotChanges().pipe(map((snapshots: any) => {
    //   return snapshots.map((postDocs: any) => {
    //     const id = postDocs.payload.doc.id;
    //     const data = postDocs.payload.doc.data();
    //     return { id, ...data };
    //   })
    // }))

    // this.reloadEvent.subscribe(() => {
    //   this.posts = []
    // })

  }

  ngOnInit(): void {
    this.afs.collection('MtrnPosts').snapshotChanges().subscribe((postDocs: any) => {
      this.lastPostsSnapshot = postDocs
      if (this.posts.length == 0 || this.needToResortPosts) {
        // First time
        this.resortPosts()

      } else {
        // Already loaded posts

        const existingPostIds = this.posts.map((post) => { return post.id })
        var postDocsIds = []

        // Iterate through posts
        for (let postDoc of postDocs) {
          const id = postDoc.payload.doc.id
          postDocsIds.push(id)
          const data = postDoc.payload.doc.data()
          const post = { ...data, id }

          if (existingPostIds.includes(id)) {
            // Replace post into ordered list
            const idx = existingPostIds.indexOf(id)
            this.posts[idx] = post

          } else {
            // Add new post to end
            this.posts.push(post)
          }
        }

        // Remove posts deleted by user
        for (let id of existingPostIds) {
          // Check if posts not in postDocs' ids
          if (!postDocsIds.includes(id)) {
            // Only remove if deleted by user
            const idx = existingPostIds.indexOf(id)
            this.posts[idx].deleted = true
          }
        }
      }
    })
  }

  resortPosts() {
    this.posts = []

    // Append all to list
    for (let postDoc of this.lastPostsSnapshot) {
      const id = postDoc.payload.doc.id;
      const data = postDoc.payload.doc.data();
      const post = { ...data, id }
      this.posts.push(post)
    }

    // Sort
    if (this.orderBy == 'Most Votes') {
      this.posts.sort((a, b) => (a.votes > b.votes) ? -1 : ((b.votes > a.votes) ? 1 : 0))
    } else if (this.orderBy == 'Newest') {
      this.posts.sort((a, b) => (a.postedTime > b.postedTime) ? -1 : ((b.postedTime > a.postedTime) ? 1 : 0))
    } else if (this.orderBy == 'Oldest') {
      this.posts.sort((a, b) => (a.postedTime < b.postedTime) ? -1 : ((b.postedTime < a.postedTime) ? 1 : 0))
    }
    
    this.needToResortPosts = false
  }

  openNewPostDialog(): void {
    // Require login
    if (!this.auth.authenticated) {
      this.loginEvent.emit()
      return
    }

    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      maxWidth: '800px',
      width: '100%',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      const postData: NewPostData = result;

      if (postData != null && (postData.body != null || postData.title != null)) {
        // Post to database
        const newPost: Post = {
          approved: null,
          authorUid: this.auth.currentUserId,
          authorDisplayName: this.auth.currentUserDisplayName,
          body: postData.body,
          postedTime: firebase.firestore.FieldValue.serverTimestamp(),
          title: postData.title,
          voters: {},
          votes: 0
        }

        const result = this.afs.collection('MtrnPosts').add(newPost)

        this.needToResortPosts = true
        
      }
    });
  }
}
