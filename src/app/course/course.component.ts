import { LiteralPrimitive } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'

import { Observable, of } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  postsLoaded: any;
  posts$: Observable<any[]>;

  constructor(
    private afs: AngularFirestore,
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
    // this.postsLoaded = false;

    
    // this.afs.collection("MtrnPosts", ref => ref.orderBy("votes", "desc").limit(1000)).snapshotChanges().subscribe(snap => {
      // this.posts$ = snap;
      // this.postsLoaded = true;
      // console.log("postsLoaded");
      // console.log(snap)
    // });

  }

}
