import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'youtube-playlist';
  CLIENT_ID =
    "762803049191-o035n72nd4lu3c8a4pjl358akhu0bus0.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";
  playlistInfo: Array<any> = [];
  isLoggedIn = false;

  ngOnInit() {
    this.handleClientLoad()
  }

  // Load auth2 library
  handleClientLoad() {
    gapi.load("client:auth2", this.initClient);
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

  // Init API client library and set up sign in listeners
  initClient = () => {
    gapi.client
      .init({
        discoveryDocs: this.DISCOVERY_DOCS,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES,
      })
      .then(() => {
        this.loadClient()
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
        (response: any) => {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          this.getPlaylist();
        },
        function (err: any) {
          console.error("Execute error", err);
        }
      );
  }

  getPlaylist() {
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    gapi.client.youtube.playlists
      .list({
        part: ["snippet,contentDetails"],
        maxResults: 50,
        mine: true,
      })
      .then(
        (response: any) => {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          this.playlistInfo = this.formatPlaylistInfo(response.result.items)
          // this.displayPlaylist(response.result.items);
        },
        (err: any) => {
          console.error("Execute error", err);
        }
      );
  }

  formatPlaylistInfo = (items: any) => {
    return items.map((item: any) => ({ title: item.snippet.title, thumbnail: item.snippet.thumbnails.medium.url, id: item.id }))
  }

  // Handle login
  handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn({ scope: this.SCOPES })
      .then(() => {
        console.log("Sign-in successful");
        this.isLoggedIn = true
        this.getChannelInfo()
      },
        (err) => { console.error("Error signing in", { err }) });
  }

  // Handle logout
  handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => { this.isLoggedIn = false; });

  }

}
