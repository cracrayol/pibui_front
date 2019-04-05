import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from '../../model/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatSelectChange, MatDialog } from '@angular/material';
import { Tag } from '../../model/tag';
import { EditPlaylistComponent } from '../editplaylist/editplaylist.component';
import { ConfirmDialogComponent } from '../confirmDialog/confirmDialog.component';

@Component({
  selector: 'pbi-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {

  @Input() tags: Tag[];
  selected: Playlist;
  $playlist: Observable<Playlist[]>;

  constructor(public playlist: PlaylistService, public auth: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.$playlist = this.playlist.getAll().pipe(tap((playlists: Playlist[]) => {
      playlists.forEach((pl: Playlist) => {
        if (this.auth.getUser().currentPlaylistId && this.auth.getUser().currentPlaylistId === pl.id) {
          this.selected = pl;
        }
      });
    }));
  }

  set(id: number, state: number) {
    const currentPlaylist = Object.assign(<Playlist>{}, this.selected);
    if (currentPlaylist) {
      if (!currentPlaylist.forbiddenTags) {
        currentPlaylist.forbiddenTags = [];
      }
      if (!currentPlaylist.allowedTags) {
        currentPlaylist.allowedTags = [];
      }
      if (!currentPlaylist.mandatoryTags) {
        currentPlaylist.mandatoryTags = [];
      }

      const forbidden = currentPlaylist.forbiddenTags.findIndex(tag => tag.id === id);
      const allowed = currentPlaylist.allowedTags.findIndex(tag => tag.id === id);
      const mandatory = currentPlaylist.mandatoryTags.findIndex(tag => tag.id === id);

      let insert = true;
      if (forbidden > -1) {
        if (state === 0) { insert = false; }
        currentPlaylist.forbiddenTags.splice(forbidden, 1);
      }
      if (allowed > -1) {
        if (state === 1) { insert = false; }
        currentPlaylist.allowedTags.splice(allowed, 1);
      }
      if (mandatory > -1) {
        if (state === 2) { insert = false; }
        currentPlaylist.mandatoryTags.splice(mandatory, 1);
      }

      if (insert) {
        switch (state) {
          case 0:
            currentPlaylist.forbiddenTags.push({ id: id });
            break;
          case 1:
            currentPlaylist.allowedTags.push({ id: id });
            break;
          case 2:
            currentPlaylist.mandatoryTags.push({ id: id });
            break;
        }
      }
    }
    this.playlist.put(currentPlaylist).subscribe(() => {
      this.selected.forbiddenTags = currentPlaylist.forbiddenTags;
      this.selected.allowedTags = currentPlaylist.allowedTags;
      this.selected.mandatoryTags = currentPlaylist.mandatoryTags;
    });
  }

  isTagSet(id: number, state: number): boolean {
    const currentPlaylist = this.selected;
    if (currentPlaylist) {
      switch (state) {
        case 0:
          return currentPlaylist.forbiddenTags.findIndex(tag => tag.id === id) > -1;
        case 1:
          return currentPlaylist.allowedTags.findIndex(tag => tag.id === id) > -1;
        case 2:
          return currentPlaylist.mandatoryTags.findIndex(tag => tag.id === id) > -1;
      }
    }
    return false;
  }

  selectPlaylist(change: MatSelectChange) {
    if (change.value) {
      this.auth.getUser().currentPlaylistId = change.value.id;
      this.selected = change.value;
    } else {
      this.auth.getUser().currentPlaylistId = null;
    }
    this.auth.saveUser();
  }

  editPlaylistDialog(newPlaylist: boolean): void {
    const dialogRef = this.dialog.open(EditPlaylistComponent, {
      width: '400px',
      data: newPlaylist ? null : this.selected
    });

    dialogRef.afterClosed().subscribe(result => {
      if (newPlaylist && result != null) {
        this.$playlist = this.playlist.getAll().pipe(tap((playlists: Playlist[]) => {
          playlists.forEach((pl: Playlist) => {
            if (this.auth.getUser().currentPlaylistId && this.auth.getUser().currentPlaylistId === pl.id) {
              this.selected = pl;
            }
          });
        }));
      }
    });
  }

  deletePlaylist(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: 'Delete playlist ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.playlist.delete(this.selected).subscribe(_ => {
        this.selected = null;
        this.$playlist = this.playlist.getAll();
      });
    });
  }

}
