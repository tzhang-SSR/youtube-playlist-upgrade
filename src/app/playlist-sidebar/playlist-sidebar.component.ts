import { Component, OnInit, Input } from '@angular/core';
import { NewPlaylistDialogComponent } from '../new-playlist-dialog/new-playlist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-sidebar',
  templateUrl: './playlist-sidebar.component.html',
  styleUrls: ['./playlist-sidebar.component.css']
})

export class PlaylistSidebarComponent implements OnInit {
  @Input() playlistInfo: Array<any> = []
  @Input() sortOrder: string = 'default' // 'asc' or 'desc' pr 'default'

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.handleSortPlaylist(this.sortOrder)
  }

  goToHomePgae = () => {
    this.router.navigate(['/'])
  }

  openNewPlaylistDialog = () => {
    const dialogRef = this.dialog.open(NewPlaylistDialogComponent)
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload()
    });
  }

  handleSortPlaylist = (sortOrder: string) => {
    if (sortOrder === 'asc') {
      this.sortPlaylistByTitle()
    }
    if (sortOrder === 'desc') {
      this.sortPlaylistByTitle(true)
    }
  }

  sortPlaylistByTitle = (isReverse: boolean = false) => {
    const sortedPlaylistInfo = this.playlistInfo.sort(
      (a, b) => {
        const titleA = a.title.toUpperCase()
        const titleB = b.title.toUpperCase()
        if (titleA < titleB) { return isReverse ? 1 : -1 }
        if (titleA > titleB) { return isReverse ? -1 : 1 }
        return 0
      }
    )
    this.playlistInfo = sortedPlaylistInfo
  }

}
