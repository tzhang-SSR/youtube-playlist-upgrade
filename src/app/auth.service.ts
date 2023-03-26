import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GlobalVariables } from './global-variables';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private GoogleAuth: any;
  SCOPES = GlobalVariables.SCOPES

  constructor(private router: Router) { }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: GlobalVariables.API_KEY,
          discoveryDocs: GlobalVariables.DISCOVERY_DOCS,
          clientId: GlobalVariables.CLIENT_ID,
          scope: GlobalVariables.SCOPES,
        }).then(() => {
          resolve();
        }, (err: any) => { reject(err) });
      });
    });
  }

  initGoogleAuth(): Observable<boolean> {
    return from(
      this.init().then(() => {
        this.GoogleAuth = gapi.auth2.getAuthInstance();
        return this.GoogleAuth.isSignedIn.get();
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    if (!this.GoogleAuth) {
      return this.initGoogleAuth();
    } else {
      return from(Promise.resolve(this.GoogleAuth.isSignedIn.get()));
    }
  }

  signIn(): void {
    this.GoogleAuth.signIn({ scopes: this.SCOPES })
      .then(() => {
        console.log('Sign in successful')
        console.log('SignIn-Form.isSignedIn:', this.GoogleAuth.isSignedIn.get());
        // redirect user to the playlist page after sign-in
        this.router.navigate(['/playlist']);
      },
        (err: any) => { console.error("Error signing in", { err }) });
  }

  signOut(): void {
    this.GoogleAuth.signOut();
  }

  getCurrentUser(): any {
    return this.GoogleAuth.currentUser.get();
  }
}
