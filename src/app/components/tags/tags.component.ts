import { Component, Input, OnInit } from '@angular/core';
import { Playlist, TagType } from '../../model/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Tag } from '../../model/tag';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PlaylistDialogComponent } from '../playlist-dialog/playlist-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'pbi-tags',
    templateUrl: './tags.component.html',
    imports: [MatSelectModule, MatMenuModule, MatIconModule, MatListModule, MatButtonModule, MatTooltipModule, CommonModule]
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

  set(tag: Tag, state: TagType) {
    const currentPlaylist = Object.assign(<Playlist>{}, this.selected);
    const id = tag.id;
    
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
        if (state === TagType.FORBIDDEN) { insert = false; }
        currentPlaylist.forbiddenTags.splice(forbidden, 1);
      }
      if (allowed > -1) {
        if (state === TagType.ALLOWED) { insert = false; }
        currentPlaylist.allowedTags.splice(allowed, 1);
      }
      if (mandatory > -1) {
        if (state === TagType.MANDATORY) { insert = false; }
        currentPlaylist.mandatoryTags.splice(mandatory, 1);
      }

      if (insert) {
        switch (state) {
          case TagType.FORBIDDEN:
            currentPlaylist.forbiddenTags.push(tag);
            break;
          case TagType.ALLOWED:
            currentPlaylist.allowedTags.push(tag);
            break;
          case TagType.MANDATORY:
            currentPlaylist.mandatoryTags.push(tag);
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

  isTagSet(id: number, state: TagType): boolean {
    const currentPlaylist = this.selected;
    if (currentPlaylist) {
      switch (state) {
        case TagType.FORBIDDEN:
          return currentPlaylist.forbiddenTags.findIndex(tag => tag.id === id) > -1;
        case TagType.ALLOWED:
          return currentPlaylist.allowedTags.findIndex(tag => tag.id === id) > -1;
        case TagType.MANDATORY:
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
      this.selected = null;
    }
    this.auth.saveUser();
  }

  editPlaylistDialog(newPlaylist: boolean): void {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, {
      width: '500px',
      data: newPlaylist ? null : this.selected
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
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
      data: $localize`Are you sure you want to delete this playlist ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.playlist.delete(this.selected).subscribe(() => {
          this.selected = null;
          this.$playlist = this.playlist.getAll();
        });
      }
    });
  }

}
