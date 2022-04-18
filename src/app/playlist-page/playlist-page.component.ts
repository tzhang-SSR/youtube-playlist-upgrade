import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

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
  YT_VIDEO_URL = "https://www.youtube.com/watch?v="
  PAGE_SIZE = 25;

  playlistId: string = '';
  playlistItems: any;
  playlistItemsCache: any;
  pageItems: any;
  playlistVideos: any;
  pageToken: string = '';
  GoogleAuth: any;

  title = 'Title'
  videoCount = 0
  status = 'Public'
  description = 'No Description'
  thumbnail = ''
  keyword = ''

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    this.playlistItems = []
    this.playlistItemsCache = []
    this.pageItems = []
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
          this.getPlaylistInfo()
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

  getPlaylistInfo() {
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    gapi.client.youtube.playlists
      .list({
        part: ["snippet, contentDetails, status"],
        id: this.playlistId,
      })
      .then(
        (response: any) => {
          this.ngZone.run(() => {
            console.log({ response })
            // Handle the results here (response.result has the parsed body).
            const { snippet, status, contentDetails } = response.result.items[0]
            this.videoCount = contentDetails.itemCount
            this.status = status.privacyStatus || 'Public'
            const { title, description, thumbnails } = snippet
            this.title = title || 'Title'
            this.description = description || ' No Description'
            this.thumbnail = thumbnails.medium.url || ''
          })
        },
        (err: any) => {
          console.error("Execute error", err);
        }
      );
  }

  getPlaylistItems = () => {
    // get and store video items from the playlist
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
      this.playlistItemsCache = itemList

      this.pageItems = itemList.slice(0, this.PAGE_SIZE)
      this.handlePlaylistDisplay(this.pageItems)
    })
  }

  handleInitialDisplay = () => {
    this.pageItems = this.playlistItems.slice(0, this.PAGE_SIZE)
    this.handlePlaylistDisplay(this.pageItems)
  }

  handlePlaylistDisplay = (items: any) => {
    this.playlistVideos = items.map((item: any) => {
      const { title, publishedAt, thumbnails, videoOwnerChannelTitle } = item.snippet
      const img = thumbnails?.medium?.url
      const videoId = item.snippet?.resourceId?.videoId
      // check if any youtube video is inavaialble
      const isValid = title != 'Deleted Video' && Object.keys(thumbnails).length > 0
      return { videoId, title, publishedAt, owner: videoOwnerChannelTitle, img, isValid }
    })
  }

  onPageChange = (event: PageEvent) => {
    const pageIndex = event.pageIndex * this.PAGE_SIZE
    this.pageItems = this.playlistItems.slice(pageIndex, pageIndex + this.PAGE_SIZE)
    this.handlePlaylistDisplay(this.pageItems)
    window.scroll({ top: 0 });
  }

  handleSearch = () => {
    if (this.keyword) {
      const result = this.playlistItemsCache.filter((item: any) => {
        return item.snippet.title.toUpperCase().includes(this.keyword.toUpperCase())
      })
      this.playlistItems = result
      this.handleInitialDisplay()
    } else {
      this.clearSearch()
    }
  }

  clearSearch = () => {
    this.keyword = ''
    this.playlistItems = this.playlistItemsCache
    this.handleInitialDisplay()
  }
}
