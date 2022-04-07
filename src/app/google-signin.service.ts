import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GoogleSigninService {
  private auth2: gapi.auth2.GoogleAuth
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1);

  title = 'youtube-playlist';
  CLIENT_ID =
    "762803049191-pgltb7dk1rqdk7ad5d76218ggscp5m3s.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";

  constructor() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({ client_id: this.CLIENT_ID })
    });
  }

  public signIn() {
    this.auth2.signIn({
      scope: this.SCOPES
    }).then(user => { this.subject.next(user) }).catch(() => { this.subject.next(null) })
  }

  public signOut() {
    // this.auth2.signOut().then(() => { this.subject.next(null) })
  }

  public observable(): Observable<gapi.auth2.GoogleUser> {
    return this.subject.asObservable()
  }

}
