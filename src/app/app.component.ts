import { Component, NgZone } from '@angular/core';
import { PlaylistService } from './playlist.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPlaylistDialogComponent } from './new-playlist-dialog/new-playlist-dialog.component';
import { Router } from '@angular/router';
import { GlobalVariables } from './global-variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'youtube-playlist';
  
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID
  

  playlistInfo: Array<any> = [];
  GoogleAuth: any;
  isAuthorized: boolean;
  user: any;

  constructor(private ngZone: NgZone, private playlistService: PlaylistService, public dialog: MatDialog, private router: Router) {
    this.isAuthorized = false;
  }

  ngOnInit(): void {
    // Load auth2 library
    gapi.load("client:auth2", this.initClient);
    this.playlistService.getUserPlaylists().subscribe(item => {this.playlistInfo = item})
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
          this.loadClient()
        })
      });
  }

  loadClient = () => {
    gapi.client.setApiKey(this.API_KEY);
    return gapi.client
      // same as "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
      .load("youtube", "v3")
      .then(
        () => {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  setSigninStatus = () => {
    this.ngZone.run(() => {
      this.user = this.GoogleAuth.currentUser.get();
      this.isAuthorized = this.user.hasGrantedScopes(this.SCOPES);
      this.getChannelInfo()
    })
  }

  updateSigninStatus = (isSignedIn: boolean) => {
    this.ngZone.run(() => {
      this.user = this.GoogleAuth.currentUser.get();
      this.isAuthorized = this.user.hasGrantedScopes(this.SCOPES);
      if (this.isAuthorized) {
        this.getChannelInfo() //display playlist data
      } else {
        //do nothing
      }
    });
  }

  getChannelInfo() {
    //https://developers.google.com/youtube/v3/docs/channels/list?apix=true
    gapi.client.youtube.channels
      .list({
        part: ["snippet,contentDetails,statistics"],
        mine: true,
      })
      .then(
        () => {
          this.ngZone.run(() => { this.getPlaylist(); })
        },
        function (err: any) {
          console.error("Execute error", err);
        }
      );
  }

  getPlaylist() {
    this.ngZone.run(async () => {
      const response = await this.playlistService.getPlaylists()
      this.playlistInfo = this.formatPlaylistInfo(response?.result.items)
    })
  }

  formatPlaylistInfo = (items: any) => {
    return items.map((item: any) => ({ title: item.snippet.title, id: item.id }))
  }

  handleAuthClick = () => {
    this.GoogleAuth.signIn({ scope: this.SCOPES })
      .then(() => {
        // Sign-in successful
        console.log('Sign in successful')
      },
        (err: any) => { console.error("Error signing in", { err }) });
  }

  handleSignoutClick = () => {
    this.GoogleAuth.signOut();
    // this.GoogleAuth.disconnect();
  }

  openNewPlaylistDialog = () => {
    const dialogRef = this.dialog.open(NewPlaylistDialogComponent)
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload()
    });
  }

  sortPlaylistTitles = (isReverse: boolean = false) => {
    let arr = this.playlistInfo.sort(
      (a, b) => {
        const titleA = a.title.toUpperCase()
        const titleB = b.title.toUpperCase()
        if (titleA < titleB) { return isReverse ? 1 : -1 }
        if (titleA > titleB) { return isReverse ? -1 : 1 }
        return 0
      }
    )
    this.playlistInfo = arr
  }

  goToHomePgae = () => {
    this.router.navigate(['/'])
  }

}
