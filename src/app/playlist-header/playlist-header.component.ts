import { Component, OnInit, Input, NgZone } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-header',
  templateUrl: './playlist-header.component.html',
  styleUrls: ['./playlist-header.component.css']
})
export class PlaylistHeaderComponent implements OnInit {
  CLIENT_ID =
    "762803049191-65gfec9uf4414c853rfsm25kh255ob0c.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";

  @Input() playlistId: string = '';

  title = 'Title'
  videoCount = 0
  status = 'Public'
  description = 'No Description'
  thumbnail = ''

  editTitle: Boolean;
  editDescription: Boolean;

  constructor(private playlistService: PlaylistService, private ngZone: NgZone, private route: ActivatedRoute) {
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

}
