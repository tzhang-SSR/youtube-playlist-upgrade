import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'youtube-playlist';
  CLIENT_ID =
    "762803049191-4qjsrbkaab3agrabo0g0knn2bfk4a3ml.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";

  ngOnInit() {
    this.handleClientLoad()
  }

  // Load auth2 library
  handleClientLoad() {
    gapi.load("client:auth2", this.initClient);
  }

  // Init API client library and set up sign in listeners
  initClient() {
    gapi.client
      .init({
        discoveryDocs: this.DISCOVERY_DOCS,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES,
      })
      .then(() => {
        // Listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        // Handle initial sign in state
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        this.loadClient().then(() => this.getChannelInfo());

        // const authorizeButton = document.getElementById("authorize-button");
        // const signoutButton = document.getElementById("signout-button");
        // authorizeButton.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;
      });
  }

  loadClient() {
    gapi.client.setApiKey(this.API_KEY);
    return gapi.client
      // same as "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
      .load("youtube", "v3")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
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
          this.displayPlaylist(response.result.items);
        },
        (err: any) => {
          console.error("Execute error", err);
        }
      );
  }

  displayPlaylist(arr: Array<any>) {
    console.log({ arr })
    // let output = "";
    // for (const item of arr) {
    //   const { snippet } = item;
    //   const { title, thumbnails } = snippet;
    //   console.log(title, thumbnails.default.url);
    //   output += `
    //   <div>
    //         <img src=${thumbnails.medium.url} />
    //         <p>${title}</p>
    //       </div>`;
    //   videoContainer.innerHTML = output;
    // }
  }

  updateSigninStatus(isSignedIn: Boolean) {
    const authorizeButton = document.getElementById("authorize-button");
    const signoutButton = document.getElementById("signout-button");
    const content = document.getElementById("content");
    const videoContainer = document.getElementById("video-container");
    if (isSignedIn) {
      // authorizeButton.style.display = "none";
      // signoutButton.style.display = "block";
      // content.style.display = "block";
      // videoContainer.style.display = "block";
    } else {
      // authorizeButton.style.display = "block";
      // signoutButton.style.display = "none";
      // content.style.display = "none";
      // videoContainer.style.display = "none";
    }
  }

  // Handle login
  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }

  // Handle logout
  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }

}
