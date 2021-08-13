import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { MyMaterialModule } from './material/material.module'

import { AppComponent } from './app/app.component';
import { environment } from 'src/environments/environment';
import { PostComponent } from './post/post.component';
import { CourseComponent } from './course/course.component';
import { NewPostDialogComponent } from './new-post-dialog/new-post-dialog.component';

// Test components
// import { TestAddressFormComponent } from './test-address-form/test-address-form.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { TestDashComponent } from './test-dash/test-dash.component';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatCardModule } from '@angular/material/card';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { LayoutModule } from '@angular/cdk/layout';
// import { TestDragComponent } from './test-drag/test-drag.component';
// import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    CourseComponent,
    NewPostDialogComponent,
    // TestAddressFormComponent,
    // TestDashComponent,
    // TestDragComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MyMaterialModule,
    // ReactiveFormsModule,
    // MatGridListModule,
    // MatCardModule,
    // MatMenuModule,
    // MatIconModule,
    // MatButtonModule,
    // LayoutModule,
    // DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
