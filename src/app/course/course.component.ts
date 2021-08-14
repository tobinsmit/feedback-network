import { LiteralPrimitive } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'

import { Observable, of } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { Post } from '../post.model'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  @Output() loginEvent = new EventEmitter();
  postsLoaded: any;
  posts$: Observable<any[]>;
  // posts$: any;
  posts: Post[] = [];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    // this.posts$ = this.afs.collection('MtrnPosts', ref => ref.orderBy('votes','desc').limit(1000)).valueChanges()
    this.posts$ = this.afs.collection('MtrnPosts').snapshotChanges().pipe(map((snapshots:any) => {
      return snapshots.map((snapshot:any) => {
        const id = snapshot.payload.doc.id;
        const data = snapshot.payload.doc.data();
        return {id, ...data};
      })
    }))
  }

  ngOnInit(): void {
    this.afs.collection('MtrnPosts').snapshotChanges().subscribe((snapshots:any) => {
      if (this.posts.length == 0) {
        // First time

        // Append all to list
        for (let snap of snapshots) {
          const id = snap.payload.doc.id;
          const data = snap.payload.doc.data();
          const post = {...data, id}
          this.posts.push(post)
        }

        // Sort
        this.posts.sort((a,b) => (a.votes > b.votes) ? -1 : ((b.votes > a.votes) ? 1 : 0))

      } else {
        // Already loaded posts
        
        const existingPostIds = this.posts.map((post) => {return post.id})
        var snapPostIds = []

        // Iterate through posts
        for (let snap of snapshots) {
          const id = snap.payload.doc.id
          snapPostIds.push(id)
          const data = snap.payload.doc.data()
          const post = {...data, id}

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
          // Check if posts not in new snap post ids
          if (!snapPostIds.includes(id)) {
            // Only remove if deleted by user
            const idx = existingPostIds.indexOf(id)
            if (this.posts[idx].authorUid == this.auth.currentUserId) {
              this.posts.splice(idx, 1)
              alert("Successfully deleted")
            }
          }
        }
      }
    })
  }
}
