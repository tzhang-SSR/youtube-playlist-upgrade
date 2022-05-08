import { Component, OnInit, Input, NgZone } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddVideosDialogComponent } from '../add-videos-dialog/add-videos-dialog.component';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-playlist-header',
  templateUrl: './playlist-header.component.html',
  styleUrls: ['./playlist-header.component.css']
})
export class PlaylistHeaderComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  @Input() playlistId: string = '';

  title = 'Title'
  videoCount = 0
  status = 'Public'
  description = 'No Description'
  thumbnail = ''

  editTitle: Boolean;
  editDescription: Boolean;

  constructor(private playlistService: PlaylistService, private ngZone: NgZone,
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    this.editTitle = false;
    this.editDescription = false;
    this.route.paramMap.subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    gapi.load("client:auth2", this.initClient);
  }

  loadClient = () => {
    gapi.client.setApiKey(this.API_KEY);
    return gapi.client
      // "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
      .load("youtube", "v3")
      .then(
        () => {
          // GAPI client loaded for API
          this.getPlaylistData()
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
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
        this.loadClient()
      });
  }

  getPlaylistData = () => {
    this.ngZone.run(async () => {
      const response = await this.playlistService.getPlaylistInfo(this.playlistId)
      // Handle the results here (response.result has the parsed body).
      if (response.result.items) {
        const { snippet, status, contentDetails } = response.result.items[0]
        this.videoCount = contentDetails?.itemCount || 0
        this.status = status?.privacyStatus || 'Public'
        this.title = snippet?.title || 'Title'
        this.description = snippet?.description || 'No Description'
        this.thumbnail = snippet?.thumbnails?.medium?.url || ''
      }
    })
  }

  deletePlaylist = async () => {
    if (confirm('Are you sure you want to delete this?')) {
      await this.playlistService.deletePlaylist(this.playlistId)
      this.router.navigate(['/playlist'])
    }
  }

  openNewVideoDialog = () => {
    const dialogRef = this.dialog.open(AddVideosDialogComponent,
      { data: { playlistId: this.playlistId } })

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/playlist', this.playlistId])
    });
  }

}
