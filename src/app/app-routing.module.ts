import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { SigninFormComponent } from './signin-form/signin-form.component';
import { AuthGuard } from 'src/guard';

const routes: Routes = [
  { path: 'signin', component: SigninFormComponent },
  { path: 'playlist', component: PlaylistPageComponent, canActivate: [AuthGuard] },
  { path: 'playlist/:playlistId', component: PlaylistPageComponent, canActivate: [AuthGuard] },
  {
    path: 'googlef85ee20bb2a23e66.html',
  },
  { path: '**', redirectTo: 'signin' },
  { path: '', pathMatch: 'full', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
