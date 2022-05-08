import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PlaylistService } from '../playlist.service';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistDialogComponent } from '../playlist-dialog/playlist-dialog.component';
import { PlaylistDialogGroupComponent } from '../playlist-dialog-group/playlist-dialog-group.component';
import { AddVideosDialogComponent } from '../add-videos-dialog/add-videos-dialog.component';
import { Router } from '@angular/router';
import { GlobalVariables } from '../global-variables';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})

export class PlaylistPageComponent implements OnInit {
  DISCOVERY_DOCS = GlobalVariables.DISCOVERY_DOCS;
  SCOPES = GlobalVariables.SCOPES
  API_KEY = GlobalVariables.API_KEY
  CLIENT_ID = GlobalVariables.CLIENT_ID
  
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
  isEditing: boolean = false
  selectedVideos: any

  constructor(private route: ActivatedRoute, private ngZone: NgZone,
    private playlistService: PlaylistService, public dialog: MatDialog, private router: Router) {
    this.playlistItems = []
    this.playlistItemsCache = []
    this.pageItems = []
    this.route.paramMap.subscribe(params => {
      this.initializeVariables()
      this.ngOnInit();
    });
  }

  handleRecirect = () => {
    this.ngZone.run(async () => {
      const data = await this.playlistService.getPlaylists()
      const playlistItems = data.result.items
      if (playlistItems) {
        const initialPlaylistId = playlistItems[0].id
        this.router.navigate(['/playlist/', initialPlaylistId])
      }
    })
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
          if (!this.playlistId) {
            this.handleRecirect()
          } else {
            this.getPlaylistInfo()
            this.getPlaylistItems()
          }
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

  initializeVariables = () => {
    this.keyword = ''
    this.isEditing = false
    this.selectedVideos = []
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
    this.ngZone.run(async () => {
      const itemList = await this.playlistService.getPlaylistItems(this.playlistId)
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
      return { videoId, title, publishedAt, owner: videoOwnerChannelTitle, img, isValid, playlistItemId: item.id }
    })
  }

  onPageChange = (event: PageEvent) => {
    const pageIndex = event.pageIndex * this.PAGE_SIZE
    this.pageItems = this.playlistItems.slice(pageIndex, pageIndex + this.PAGE_SIZE)
    this.handlePlaylistDisplay(this.pageItems)
    window.scroll({ top: 0 });
  }

  handleSearch = () => {
    this.isEditing = false
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

  removeVideo = (id: string) => {
    this.playlistService.deleteVideofromPlaylist(id)
    window.location.reload()
  }

  openDialog = (videoId: string) => {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, { data: { videoId } })
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  findVideoIdByItemId = (itemId: string) => {
    const videoItem = this.playlistItemsCache.find((item: any) => item.id == itemId)
    return videoItem.snippet?.resourceId?.videoId
  }

  getVideoIdList = () => {
    const videoIdList = this.selectedVideos.map((id: any) => this.findVideoIdByItemId(id))
    return [...new Set(videoIdList)]
  }

  isVideoSelected = (videoId: string): boolean => {
    return this.selectedVideos.includes(videoId)
  }

  handleVideoSelecton = (videoId: string) => {
    let arr = []
    const isSelected = this.isVideoSelected(videoId)
    if (isSelected) {
      arr = this.selectedVideos.filter((e: string) => e != videoId)
    } else {
      arr = [...this.selectedVideos, videoId]
    }
    this.selectedVideos = arr
  }

  openGroupDialog = (removeVideos: boolean = false) => {
    const videoIdList = this.getVideoIdList()
    const playlistVideoIdList = this.selectedVideos

    const dialogRef = this.dialog.open(PlaylistDialogGroupComponent,
      { data: { videoIdList, playlistVideoIdList, removeVideos } })

    dialogRef.afterClosed().subscribe(result => {
      if (removeVideos) {
        window.location.reload()
      }
    });
  }

  deleteByGroup = async () => {
    for (const id of this.selectedVideos) {
      // const videoItemId = this.playlistItemsCache.find((item: any) => item.snippet.resourceId.videoId == id).id
      await this.playlistService.deleteVideofromPlaylist(id)
    }
    window.location.reload()
  }

  openNewVideoDialog = () => {
    const dialogRef = this.dialog.open(AddVideosDialogComponent,
      { data: { playlistId: this.playlistId } })

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

}
