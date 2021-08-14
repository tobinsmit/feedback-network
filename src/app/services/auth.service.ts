import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'

import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { User } from './user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // user: Observable<User>;
  authenticated: boolean = false;
  private currentAuth: any;

  constructor (
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {

    this.afAuth.authState.subscribe(auth => {
      if (auth != null) {
        this.authenticated = true
        this.currentAuth = auth
      } else {
        this.authenticated = false
        this.currentAuth = null
      }
    })
  }

  get currentUserId(): string {
    return this.authenticated ? this.currentAuth.uid : '';
  }

  get currentUserDisplayName(): any {
    return this.authenticated ? this.currentAuth.displayName : null;
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider;
    const credential = await this.afAuth.signInWithPopup(provider)
    console.log("credential", credential)
    return this.updateUserData(credential)
  }

  async microsoftSignIn() {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    const credential  = await this.afAuth.signInWithPopup(provider)
    return this.updateUserData(credential)
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private updateUserData(credential: any) {
    const user = credential.user
    const userRef = this.afs.doc(`users/${user.uid}`)

    var data: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      lastSignInTime: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (credential.additionalUserInfo.isNewUser) {
      data["creationTime"] = firebase.firestore.FieldValue.serverTimestamp()
    }

    return userRef.set(data, {merge: true})
  }

  
}
