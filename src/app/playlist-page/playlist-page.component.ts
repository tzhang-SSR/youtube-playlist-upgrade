import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit {
  CLIENT_ID =
    "762803049191-65gfec9uf4414c853rfsm25kh255ob0c.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";
  VIDEO_URL = "https://www.youtube.com/watch?v="

  playlistId: string = '';
  playlistItems: any
  playlistVideos: any;
  pageToken: string = '';
  GoogleAuth: any;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    this.playlistItems = []
    this.route.paramMap.subscribe(params => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.playlistId = params.playlistId
      // Load auth2 library
      gapi.load("client:auth2", this.initClient);
    })
  }

  loadClient = () => {
    gapi.client.setApiKey(this.API_KEY);
    return gapi.client
      // "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
      .load("youtube", "v3")
      .then(
        () => {
          // GAPI client loaded for API
          this.getPlaylistItems()
          console.log('items', this.playlistItems)
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

  getPlaylistItems = () => {
    let pageToken = ''
    let itemList: any[] = []

    this.ngZone.run(async () => {
      do {
        // https://developers.google.com/youtube/v3/docs/playlistItems/list
        const res = await gapi.client.youtube.playlistItems.list({
          "part": [
            "snippet,contentDetails"
          ],
          "maxResults": 50,
          "playlistId": this.playlistId,
          "pageToken": pageToken
        })
        const data = await res;
        const { nextPageToken, items } = data.result
        pageToken = nextPageToken || ''
        itemList = itemList.concat(items)
      } while (pageToken)

      this.playlistItems = itemList
      this.handlePlaylistDisplay(this.playlistItems)
    })
  }


  handlePlaylistDisplay = (items: any) => {
    this.playlistVideos = items.map((item: any) => {
      const { title, publishedAt, thumbnails, videoOwnerChannelTitle } = item.snippet
      const img = thumbnails?.medium?.url
      const videoId = item.snippet?.resourceId?.videoId
      // check if youtube video inavaialble
      const isValid = title != 'Deleted Video' && Object.keys(thumbnails).length > 0
      return { videoId, title, publishedAt, owner: videoOwnerChannelTitle, img, isValid }
    })
    console.log(this.playlistVideos)
  }

}
