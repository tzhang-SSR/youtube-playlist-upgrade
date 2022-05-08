import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../playlist.service';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-add-videos-dialog',
  templateUrl: './add-videos-dialog.component.html',
  styleUrls: ['./add-videos-dialog.component.css']
})
export class AddVideosDialogComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  keyword: string = ''
  videoItems: Array<any> = []
  selectedVideos: Array<string> = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: { playlistId: string },
    public dialogRef: MatDialogRef<AddVideosDialogComponent>,
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

  searchVideos = async () => {
    const response = await this.playlistService.searchVideobyKeywords(this.keyword)
    this.displaySearchResults(response?.result.items)
  }

  displaySearchResults = (items: any) => {
    this.videoItems = items.map((item: any) => {
      const videoId = item.id.videoId
      const { title, thumbnails } = item.snippet
      const thumbnail = thumbnails.medium.url //120 90
      return { videoId, title, thumbnail }
    })
  }

  isVideoSelected = (videoId: string) => {
    return this.selectedVideos.includes(videoId)
  }

  handleSelection = (videoId: string) => {
    let arr: Array<any> = []
    if (this.isVideoSelected(videoId)) {
      arr = this.selectedVideos.filter(id => id != videoId)
    } else {
      arr = [...this.selectedVideos, videoId]
    }
    this.selectedVideos = arr
  }

  addVideos = async () => {
    if (this.selectedVideos.length > 0) {
      const playlistId = this.data.playlistId
      for (const videoId of this.selectedVideos) {
        await this.playlistService.addVideotoPlaylist(playlistId, videoId)
      }
    }
    this.dialogRef.close();
  }

}
