import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit {
  playlistId: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.playlistId = routeParams.get('playlistId');
    console.log(this.playlistId)
  }

  getPlaylistItems = () => {
    //https://developers.google.com/youtube/v3/docs/playlistItems/list
  }

}
