import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  coursePassword: string = '';
  correctPassword: boolean | null = null;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    public auth: AuthService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  login(): void {
    this.auth.googleSignIn().then(() => {this.dialogRef.close()})
  }
}
