import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import firebase from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'

import { AuthService } from '../services/auth.service'
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component'
import { NewPostData } from '../new-post-dialog/new-post-data.model'
import { LoginDialogComponent } from '../login-dialog/login-dialog.component'
import { Post } from '../post.model';

// import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name: string = 'toto';
  animal: string = 'new animal';

  constructor (
    public auth: AuthService,
    private dialog: MatDialog,
    private afs: AngularFirestore,
  ) {
    
  }
  
  openDialog(): void {
    // Require login
    if (!this.auth.authenticated) {
      this.openLoginDialog()
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
      }
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      maxWidth: '400px',
      width: '100%',
    });
  }
}

