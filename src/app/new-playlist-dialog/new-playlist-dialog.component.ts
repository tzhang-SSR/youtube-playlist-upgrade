import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../playlist.service';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-new-playlist-dialog',
  templateUrl: './new-playlist-dialog.component.html',
  styleUrls: ['./new-playlist-dialog.component.css']
})
export class NewPlaylistDialogComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  title: string = ''
  isPublic: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoId: string },
    public dialogRef: MatDialogRef<NewPlaylistDialogComponent>,
    private playlistService: PlaylistService) {
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
          // this.getPlaylistData()
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

  addNewPlaylist = async () => {
    if (this.title) {
      await this.playlistService.createNewPlaylist(this.title, this.isPublic)
      this.dialogRef.close();
    } else {
      alert('Title cannot be empty!')
    }
  }

}
