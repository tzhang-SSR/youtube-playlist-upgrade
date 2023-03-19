import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgZone } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables';
import { Observable, from } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  GoogleAuth: any;
  isSignedIn: boolean = false;

  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  constructor(private router: Router, private ngZone: NgZone, private authService: AuthService) { }


  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   //redirect root url to signin page
  //   if (state.url === '/') {
  //     this.router.navigate(['/signin']);
  //   }

  //   gapi.load("client:auth2", () => {
  //     gapi.client
  //       .init({
  //         apiKey: this.API_KEY,
  //         discoveryDocs: this.DISCOVERY_DOCS,
  //         clientId: this.CLIENT_ID,
  //         scope: this.SCOPES,
  //       })
  //       .then(() => {
  //         this.ngZone.run(() => {
  //           this.GoogleAuth = gapi.auth2.getAuthInstance();
  //           this.isSignedIn = this.GoogleAuth.isSignedIn.get()

  //           if (this.isSignedIn) {
  //             return true;
  //           } else {
  //             this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
  //             return false
  //           }

  //         });
  //       });
  //   });

  //   return this.isSignedIn

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // redirect root url to signin page
    if (state.url === '/') {
      this.router.navigate(['/signin']);
      return from(Promise.resolve(false));
    }

    return this.authService.isAuthenticated().pipe(map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
    );
  }
}

