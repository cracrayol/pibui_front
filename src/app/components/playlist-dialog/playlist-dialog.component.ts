import { Component, AfterViewChecked, ChangeDetectorRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist, TagType } from '../../model/playlist';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TagAutocompleteComponent } from '../tag-autocomplete/tag-autocomplete.component';

@Component({
    selector: 'pbi-playlist-dialog',
    templateUrl: './playlist-dialog.component.html',
    imports: [TagAutocompleteComponent, MatDialogModule, MatInputModule, MatCheckboxModule, MatChipsModule, MatButtonModule, MatIconModule, ReactiveFormsModule]
})
export class PlaylistDialogComponent implements AfterViewChecked {
  private fb = inject(FormBuilder);
  private ref = inject(ChangeDetectorRef);
  private snack = inject(MatSnackBar);
  private dialogRef = inject<MatDialogRef<PlaylistDialogComponent>>(MatDialogRef);
  private playlistService = inject(PlaylistService);
  private inputPlaylist = inject<Playlist>(MAT_DIALOG_DATA);

  readonly TagType = TagType;

  playlistForm: FormGroup;
  playlist: Playlist;

  constructor() {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      public: ''
    });

    this.playlist = this.inputPlaylist != null ? structuredClone(this.inputPlaylist) : {};

    if (this.inputPlaylist != null) {
      this.playlist = structuredClone(this.inputPlaylist);
      this.playlistForm.setValue({
        name: this.playlist.name,
        public: this.playlist.public
      });
    } else {
      this.playlist = {
        mandatoryTags: [],
        allowedTags: [],
        forbiddenTags: [],
      };
    }
  }

  save() {
    this.playlist.name = this.playlistForm.value.name;
    this.playlist.public = this.playlistForm.value.public;

    if (this.playlist.id != null) {
      this.playlistService.put(this.playlist).subscribe((result) => {
        this.dialogRef.close(result);
        this.snack.open($localize`Updated !!`, '', {
          duration: 5000
        });
      });
    } else {
      this.playlistService.post(this.playlist).subscribe(result => {
        this.dialogRef.close(result);
        this.snack.open($localize`Created !!`, '', {
          duration: 5000
        });
      });
    }
  }

  removeTag(tagId: number, state: TagType) {
    switch(state) {
      case TagType.MANDATORY :
        this.playlist.mandatoryTags.splice(this.playlist.mandatoryTags.findIndex(tag => tag.id === tagId), 1);
        break;
      case TagType.ALLOWED :
        this.playlist.allowedTags.splice(this.playlist.allowedTags.findIndex(tag => tag.id === tagId), 1);
        break;
      case TagType.FORBIDDEN :
        this.playlist.forbiddenTags.splice(this.playlist.forbiddenTags.findIndex(tag => tag.id === tagId), 1);
        break;
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
