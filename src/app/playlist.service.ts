import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  CLIENT_ID =
    "762803049191-65gfec9uf4414c853rfsm25kh255ob0c.apps.googleusercontent.com";
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  SCOPES = "https://www.googleapis.com/auth/youtube";

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void { }

  getPlaylists = async () => {
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    const res = await gapi.client.youtube.playlists
      .list({
        part: ["snippet"],
        maxResults: 50,
        mine: true,
      })
    const data = await res
    return data
  }

  deletePlaylistItems = async (id: string) => {
    try {
      const res = await gapi.client.youtube.playlistItems.delete({ id })
      const result = await res
      console.log({ result })
      return result
    } catch (err) {
      console.log({ err })
    }
    return null
  }

  getPlaylistInfo = async (playlistId: string) => {
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    const res = await gapi.client.youtube.playlists
      .list({
        part: ["snippet, contentDetails, status"],
        id: playlistId,
      })
    const data = await res
    return data
  }
}
