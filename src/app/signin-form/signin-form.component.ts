import { Component, NgZone, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { GlobalVariables } from '../global-variables';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css']
})

export class SigninFormComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  playlistInfo: Array<any> = [];
  GoogleAuth: any;
  isAuthorized: boolean;
  user: any;

  constructor(private ngZone: NgZone, private playlistService: PlaylistService, private router: Router, private authService: AuthService) {
    this.isAuthorized = false;
  }

  ngOnInit(): void {
    // Load auth2 library
    gapi.load("client:auth2", this.initClient);
  }

  // Init API client library and set up sign in listeners
  initClient = () => {
    gapi.client
      .init({
        apiKey: this.API_KEY,
        discoveryDocs: this.DISCOVERY_DOCS,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES,
      })
      .then(() => {
        this.ngZone.run(() => {
          this.GoogleAuth = gapi.auth2.getAuthInstance();
          // Listen for sign-in state changes.
          this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
          // Handle initial sign-in state. (Determine if user is already signed in.)
          this.setSigninStatus()
        })
      });
  }

  handleAuthClick = () => {
    // this.authService.signIn()
    this.ngZone.run(() => {
      this.GoogleAuth.signIn({ scope: this.SCOPES })
        .then(() => {
          console.log('Sign in successful')
          console.log('SignIn-Form.isSignedIn:', this.GoogleAuth.isSignedIn.get());
          // redirect user to the playlist page after sign-in
          this.router.navigate(['/playlist']);
        },
          (err: any) => { console.error("Error signing in", { err }) });
    })
  }

  setSigninStatus = () => {
    this.ngZone.run(() => {
      this.user = this.GoogleAuth.currentUser.get();
      this.isAuthorized = this.user.hasGrantedScopes(this.SCOPES);
      // redirect user to the playlist page if they are already signed in
      if (this.isAuthorized) {
        this.ngZone.run(() => {
          this.router.navigate(['/playlist'])
        })
      }
    })
  }

  updateSigninStatus = () => {
    this.ngZone.run(() => {
      this.setSigninStatus()
    });
  }

}
