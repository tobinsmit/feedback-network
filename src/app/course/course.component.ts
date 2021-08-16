import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AngularFirestore } from '@angular/fire/firestore'
import firebase from 'firebase/app';

import { Observable, of } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { Post } from '../post/post.model'
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
  newPosts: Post[] = [];
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
        const existingNewPostIds = this.newPosts.map((post) => {return post.id});
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
            // Add new post to end of new posts
            const idx = existingNewPostIds.indexOf(id)
            if (idx == -1) {
              // Post not in existing new posts
              // Add to end
              this.newPosts.push(post)
            } else {
              // Replace with new post data
              this.newPosts[idx] = post
            }
            
          }
        }

        // Remove posts deleted by user
        // Iterate through existingPostIds
        for (let id of existingPostIds) {
          // Check if id not in postDocs' ids
          if (!postDocsIds.includes(id)) {
            // Add deleted attribute to trigger overlay
            const idx = existingPostIds.indexOf(id)
            this.posts[idx].deleted = true
          }
        }
        // Iterate through existingNewPostIds
        for (let id of existingNewPostIds) {
          // Check if id not in postDocs' ids
          if (!postDocsIds.includes(id)) {
            // Add deleted attribute to trigger overlay
            const idx = existingNewPostIds.indexOf(id)
            this.newPosts[idx].deleted = true
          }
        }
      }
    })
  }

  resortPosts() {
    this.posts = []
    this.newPosts = []

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

        const result = this.afs.collection('MtrnPosts').add(newPost).then(() => {
          this.needToResortPosts = true
        })
      }
    });
  }
}
