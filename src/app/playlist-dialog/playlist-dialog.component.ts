import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../playlist.service';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.css']
})
export class PlaylistDialogComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  playlistStatusList: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { videoId: string },
    public dialogRef: MatDialogRef<PlaylistDialogComponent>,
    private playlistService: PlaylistService,
    private ngZone: NgZone) {
    this.playlistStatusList = []
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

  getPlaylistData = (): any => {
    this.ngZone.run(
      async () => {
        const response = await this.playlistService.getPlaylists()
        if (response) {
          const playlistItems = response.result.items
          const len = playlistItems?.length || 0
          let statusList = []

          // traverse playlists to check if current video exists in the playlsit
          for (let i = 0; i < len; i++) {
            const item = playlistItems ? playlistItems[i] : {}
            const privacyStatus = item.status?.privacyStatus
            const playlistId = item.id || ''
            const statusResult = await this.getVideoStatus(playlistId, this.data.videoId)
            const { inPlaylist, playlistItemId } = statusResult
            const videoStatus = { playlistId, title: item?.snippet?.title, inPlaylist, playlistItemId, privacyStatus }
            statusList.push(videoStatus)
          }

          this.playlistStatusList = statusList
        }
      }
    )
  }

  getVideoStatus = (playlistId: string, videoId: string) => {
    return this.ngZone.run(async () => {
      let inPlaylist = false
      let playlistItemId = ''
      const itemList = await this.playlistService.getPlaylistItems(playlistId)
      const item = itemList.find((item: any) => item.snippet.resourceId.videoId == videoId)
      if (item) {
        inPlaylist = true
        playlistItemId = item.id
      }
      return { inPlaylist, playlistItemId }
    })
  }


  handleToggle = (event: any, playlistId: string) => {
    const { videoId } = this.data
    if (event.checked) {
      // add video the playlist
      this.playlistService.addVideotoPlaylist(playlistId, videoId)
    } else {
      this.ngZone.run(async () => {
        // remove video from the playlist
        const itemList = await this.playlistService.getPlaylistItems(playlistId)
        const item = itemList.find((item: any) => item.snippet.resourceId.videoId == videoId)
        this.playlistService.deleteVideofromPlaylist(item.id)
      })
    }
  }

}
