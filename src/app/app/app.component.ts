import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service'

import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
    public dialog: MatDialog
  ) {
    
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      maxWidth: '800px',
      width: '100%',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("result", result)
      this.animal = result;
    });
  }

  requestLogin() {
    // Show a log in pop up
  }
}

