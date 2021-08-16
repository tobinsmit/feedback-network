import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// import firebase from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'

import { AuthService } from '../services/auth.service'
import { CourseComponent } from '../course/course.component'
import { LoginDialogComponent } from '../login-dialog/login-dialog.component'
// import { Post } from '../post/post.model';

// import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  reloadEvent = new EventEmitter();

  @ViewChild(CourseComponent) courseComponent: CourseComponent;

  constructor (
    public auth: AuthService,
    private dialog: MatDialog,
  ) {
    
  }
  
  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      maxWidth: '400px',
      width: '100%',
    })
    .afterClosed().subscribe(result => {
      this.courseComponent.resortPosts();
    })
  }
}

