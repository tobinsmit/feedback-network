import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

import { NewPostData } from './new-post-data.model'
import { Post } from '../post.model'
@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
  styleUrls: ['./new-post-dialog.component.scss']
})
export class NewPostDialogComponent {
  post: NewPostData = { title: null, body: null };
  showPreview: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NewPostDialogComponent>,
    public auth: AuthService,
    //   @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  newPostDataToPostData(post: NewPostData) : Post {
    return {
      title: post.title,
      body: post.body,
      votes: 0,
      voters: {},
      id: null,
      postedTime: -1,
      authorDisplayName: this.auth.currentUserDisplayName,
      authorUid: this.auth.currentUserId,
      approved: null,
    }
  }

}
