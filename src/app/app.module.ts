import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { PlaylistDialogComponent } from './playlist-dialog/playlist-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PlaylistHeaderComponent } from './playlist-header/playlist-header.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlaylistDialogGroupComponent } from './playlist-dialog-group/playlist-dialog-group.component';
import { NewPlaylistDialogComponent } from './new-playlist-dialog/new-playlist-dialog.component';
import { AddVideosDialogComponent } from './add-videos-dialog/add-videos-dialog.component';
import { SigninFormComponent } from './signin-form/signin-form.component';
import { PlaylistPageContentComponent } from './playlist-page-content/playlist-page-content.component';
import { PlaylistSidebarComponent } from './playlist-sidebar/playlist-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistPageComponent,
    PlaylistDialogComponent,
    PlaylistHeaderComponent,
    PlaylistDialogGroupComponent,
    NewPlaylistDialogComponent,
    AddVideosDialogComponent,
    SigninFormComponent,
    PlaylistPageContentComponent,
    PlaylistSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
