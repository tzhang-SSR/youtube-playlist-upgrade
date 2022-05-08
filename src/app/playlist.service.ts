import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  // CLIENT_ID =
  //   "762803049191-65gfec9uf4414c853rfsm25kh255ob0c.apps.googleusercontent.com";
  CLIENT_ID = "665732569510-2nkdd47ucsthr3cnvb7vbtocs1lv972m.apps.googleusercontent.com"
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  // API_KEY = "AIzaSyDAKaHlIA8BZpS2cLeOEQ0rClFR8KCy258";
  API_KEY = "AIzaSyCHmu8woYHvRij4_XyMLjTxojEh3N8YON0"
  SCOPES = "https://www.googleapis.com/auth/youtube";

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void { }

  getPlaylists = async () => {
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    const res = await gapi.client.youtube.playlists
      .list({
        part: ["snippet, status",],
        maxResults: 50,
        mine: true,
      })
    const data = await res
    return data
  }

  getPlaylistItems = async (playlistId: string) => {
    let pageToken = ''
    let itemList: any[] = []

    do {
      // https://developers.google.com/youtube/v3/docs/playlistItems/list
      const res = await gapi.client.youtube.playlistItems.list({
        "part": [
          "snippet,contentDetails"
        ],
        "maxResults": 50,
        "playlistId": playlistId,
        "pageToken": pageToken
      })
      const data = await res;
      const { nextPageToken, items } = data.result
      pageToken = nextPageToken || ''
      itemList = itemList.concat(items)
    } while (pageToken)
    return itemList
  }

  deleteVideofromPlaylist = async (id: string) => {
    try {
      const res = await gapi.client.youtube.playlistItems.delete({ id })
      const result = await res
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

  addVideotoPlaylist = async (playlistId: string, videoId: string) => {
    const res = await gapi.client.youtube.playlistItems
      .insert({
        part: ["snippet"],
        resource: {
          snippet: {
            playlistId,
            position: 0,
            resourceId: {
              kind: "youtube#video",
              videoId,
            }
          }
        }
      })
    const response = await res
    // console.log({ response })
  }

  createNewPlaylist = async (title: string, isPublic: boolean = false) => {
    try {
      const res = await gapi.client.youtube.playlists
        .insert({
          part: ["snippet, status"],
          resource: {
            snippet: {
              title
            },
            status: {
              privacyStatus: isPublic ? "public" : 'private'
            }
          }
        })
      const response = await res
      return response
    } catch (err) {
      console.log({ err })
    }
    return null
  }

  deletePlaylist = async (playlistId: string) => {
    const res = await gapi.client.youtube.playlists.delete({
      "id": playlistId
    })
    const response = await res
  }

  searchVideobyKeywords = async (keywords: string) => {
    try {
      const res = await gapi.client.youtube.search.list({
        part: [
          "snippet"
        ],
        maxResults: 6,
        q: keywords
      })
      const response = await res
      return response
    } catch (err) {
      console.log({ err })
    }
    return null
  }

}
