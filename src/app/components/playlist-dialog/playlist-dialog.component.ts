import { Component, AfterViewChecked, ChangeDetectorRef, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  private fb = inject(UntypedFormBuilder);
  private ref = inject(ChangeDetectorRef);
  private snack = inject(MatSnackBar);
  dialogRef = inject<MatDialogRef<PlaylistDialogComponent>>(MatDialogRef);
  private playlistService = inject(PlaylistService);
  inputPlaylist = inject<Playlist>(MAT_DIALOG_DATA);


  readonly TagType = TagType;

  playlistForm: UntypedFormGroup;
  playlist: Playlist;

  constructor() {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      public: ''
    });

    this.playlist = structuredClone(this.inputPlaylist);

    if (this.playlist) {
      this.playlistForm.setValue({
        name: this.playlist.name,
        public: this.playlist.public
      });
    }
  }

  save() {
    if (this.playlist) {
      this.playlist.name = this.playlistForm.value.name;
      this.playlist.public = this.playlistForm.value.public;

      this.playlistService.put(this.playlist).subscribe((result) => {
        this.dialogRef.close(result);
        this.snack.open($localize`Updated !!`, '', {
          duration: 5000
        });
      });
    } else {
      this.playlist = {
        name: this.playlistForm.value.name,
        public: this.playlistForm.value.public
      };

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
