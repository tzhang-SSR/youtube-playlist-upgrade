import { Injectable, NgZone } from '@angular/core';
import { GlobalVariables } from './global-variables';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID

  private userPlaylists: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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
    // turn fetched user playlist title list into obserevable and subscribe to it
    // reference: https://stackoverflow.com/questions/59449661/angular-how-to-subscribe-data-from-component-to-component
    const formattedPlaylistInfo = this.formatPlaylistInfo(data.result.items)
    this.userPlaylists.next(formattedPlaylistInfo);
    // this.userPlaylists = this.formatPlaylistInfo(data.result.items)
    return data
  }

  getPlaylistItems = async (playlistId: string) => {
    let pageToken = ''
    let itemList: any[] = []
    try {
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
    } catch (err) {
      console.log({ err })
    }
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
    let playlistInfo: any = {}
    //https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
    try {
      const res = await gapi.client.youtube.playlists
        .list({
          part: ["snippet, contentDetails, status"],
          id: playlistId,
        })
      playlistInfo = await res
    } catch (err) {
      console.log({ err })
    }

    return playlistInfo
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

  // formatPlaylistInfo = (items: any) => items.map((item: any) => ({ title: item.snippet.title, id: item.id }))
  formatPlaylistInfo = (items: any) => {
    return items.map((item: any) => ({ title: item.snippet.title, id: item.id }))
  }

  getUserPlaylists = () => this.userPlaylists.asObservable();

}
