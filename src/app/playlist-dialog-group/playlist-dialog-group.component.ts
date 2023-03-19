import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../playlist.service';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-playlist-dialog-group',
  templateUrl: './playlist-dialog-group.component.html',
  styleUrls: ['./playlist-dialog-group.component.css']
})
export class PlaylistDialogGroupComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  playlistStatusList: any
  selectedPlaylists: Array<string> = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { videoIdList: Array<string>, playlistVideoIdList: Array<string>, removeVideos: boolean },
    public dialogRef: MatDialogRef<PlaylistDialogGroupComponent>,
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

            const videoStatus = { playlistId, title: item?.snippet?.title, privacyStatus }
            statusList.push(videoStatus)
          }
          this.playlistStatusList = statusList
        }

      }
    )
  }

  isPlaylistSelected = (playlistId: string) => {
    return this.selectedPlaylists.includes(playlistId)
  }


  handleToggle = (playlistId: string) => {
    const isSelected = this.isPlaylistSelected(playlistId)
    let arr = []
    if (isSelected) {
      arr = this.selectedPlaylists.filter(e => e != playlistId)
    } else {
      arr = [...this.selectedPlaylists, playlistId]
    }
    this.selectedPlaylists = arr
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


  handleSave = async () => {
    const { videoIdList, playlistVideoIdList, removeVideos } = this.data
    // check if any playlists is selected
    if (this.selectedPlaylists.length > 0) {
      // copy videos to playlist
      for (const playlistId of this.selectedPlaylists) {
        for (const id of videoIdList) {
          await this.playlistService.addVideotoPlaylist(playlistId, id)
        }
      }
      if (removeVideos) {
        // delete videos from the current playlist
        for (const id of playlistVideoIdList) {
          await this.playlistService.deleteVideofromPlaylist(id)
        }
      }
    }
  }

}
