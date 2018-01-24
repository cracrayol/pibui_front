import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from '../../model/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatSelectChange } from '@angular/material';
import { Tag } from '../../model/tag';

@Component({
  selector: 'pbi-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {

  @Input() tags: Tag[];
  selected: Playlist;
  $playlist: Observable<Playlist[]>;

  constructor(public playlist: PlaylistService, public auth: AuthService) { }

  ngOnInit() {
    this.$playlist = this.playlist.getAll().pipe(tap((playlists: Playlist[]) => {
      playlists.forEach((pl: Playlist) => {
        if (pl.current) {
          this.selected = pl;
        }
      });
    }));
  }

  set(id: number, state: number) {
    const currentPlaylist = Object.assign(<Playlist>{}, this.selected);
    if (currentPlaylist) {
      if (!currentPlaylist.playlistTag) {
        currentPlaylist.playlistTag = [];
      }
      const playlistTag = currentPlaylist.playlistTag.find(tag => tag.tag === id);
      if (playlistTag) {
        if (playlistTag.state === state) {
          currentPlaylist.playlistTag = currentPlaylist.playlistTag.filter(tag => tag.tag !== id);
        } else {
          playlistTag.state = state;
        }
      } else {
        currentPlaylist.playlistTag.push({
          playlist: currentPlaylist.id,
          state: state,
          tag: id
        });
      }
    }
    this.playlist.post(currentPlaylist).subscribe(() => {
      this.selected.playlistTag = currentPlaylist.playlistTag;
    });
  }

  isTagSet(id: number, state: number): boolean {
    const currentPlaylist = this.selected;
    if (currentPlaylist && currentPlaylist.playlistTag) {
      return currentPlaylist.playlistTag.findIndex(tag => tag.tag === id && tag.state === state) > -1;
    }
    return false;
  }

  selectPlaylist(change: MatSelectChange) {
    if (this.selected) {
      this.selected.current = false;
      this.playlist.post(this.selected).subscribe();
    }
    if (change.value) {
      change.value.current = true;
      this.playlist.post(change.value).subscribe(() => {
        this.selected = change.value;
      });
    } else {
      this.selected = null;
    }
  }

}
