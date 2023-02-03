import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private ngZone: NgZone) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    let GoogleAuth: any;
    this.ngZone.run(() => {
      GoogleAuth = gapi.auth2.getAuthInstance();
    });
    if (GoogleAuth?.isSignedIn) {
      // logged in so return true
      return true;
    }
    this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false
  }
}
