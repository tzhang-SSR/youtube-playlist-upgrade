import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { SigninFormComponent } from './signin-form/signin-form.component';

const routes: Routes = [
  { path: 'signin', component: SigninFormComponent },
  { path: 'playlist', component: PlaylistPageComponent },
  { path: 'playlist/:playlistId', component: PlaylistPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }