import { Component, NgZone } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPlaylistDialogComponent } from '../new-playlist-dialog/new-playlist-dialog.component';
import { Router } from '@angular/router';
import { GlobalVariables } from '../global-variables';
import { ActivatedRoute } from '@angular/router';
import { PlaylistSidebarComponent } from '../playlist-sidebar/playlist-sidebar.component';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})

export class PlaylistPageComponent {
  title = 'youtube-playlist';

  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  playlistId: string = '';
  playlistInfo: Array<any> = [];
  GoogleAuth: any;
  isAuthorized: boolean;
  user: any;
  sortOrder: string = 'default'
  userHasNoChannel: boolean = false

  constructor(private route: ActivatedRoute, private ngZone: NgZone, private playlistService: PlaylistService, public dialog: MatDialog, private router: Router) {
    this.isAuthorized = false;
    this.route.paramMap.subscribe(params => {
      this.ngOnInit();
    });
  }

  handleRedirect = () => {
    this.ngZone.run(async () => {
      const response = await this.playlistService.getPlaylists()
      if (response) {
        const playlistItems = response.result.items
        if (playlistItems) {
          const initialPlaylistId = playlistItems[0].id
          this.router.navigate(['/playlist/', initialPlaylistId])
        }
      }
    })
  }

  // Load auth2 library
  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.playlistId = params.playlistId
      gapi.load("client:auth2", this.initClient);
      this.playlistService.getUserPlaylists().subscribe(item => { this.playlistInfo = item })
    })
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


  // "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
  loadClient = () => {
    gapi.client.setApiKey(this.API_KEY);
    return gapi.client
      .load("youtube", "v3")
      .then(
        () => {
          if (!this.playlistId) {
            this.handleRedirect()
          }
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

  updateSigninStatus = () => {
    this.ngZone.run(() => {
      this.user = this.GoogleAuth.currentUser.get();
      this.isAuthorized = this.user.hasGrantedScopes(this.SCOPES);
      if (this.isAuthorized) {
        this.getChannelInfo() //display playlist data
      } else {
        this.router.navigate(['/signin'])
      }
    });
  }

  // Ref: https://developers.google.com/youtube/v3/docs/channels/list?apix=true
  getChannelInfo() {
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
      if (response) {
        if (typeof response === 'string') {
          this.userHasNoChannel = true
          console.log('user has no channel')
        } else {
          this.playlistInfo = this.formatPlaylistInfo(response?.result.items)
        }
      }
    })
  }

  formatPlaylistInfo = (items: any) => {
    return items.map((item: any) => ({ title: item.snippet.title, id: item.id }))
  }

  handleSignoutClick = () => {
    this.GoogleAuth.signOut();
    // this.router.navigate(['/signin'])
  }

  openNewPlaylistDialog = () => {
    const dialogRef = this.dialog.open(NewPlaylistDialogComponent)
    // dialogRef.afterClosed().subscribe(() => {
    //   window.location.reload()
    // });
  }

  setSortOrder = (sortOrder: string) => {
    this.sortOrder = sortOrder
  }

  goToHomePage = () => {
    this.router.navigate(['/'])
  }

}
