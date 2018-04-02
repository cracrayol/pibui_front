import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../model/playlist';

@Component({
  selector: 'pbi-editplaylist',
  templateUrl: './editplaylist.component.html',
  styleUrls: ['./editplaylist.component.scss']
})
export class EditPlaylistComponent implements AfterViewChecked {

  playlistForm: FormGroup;
  playlist: Playlist;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<EditPlaylistComponent>, private playlists: PlaylistService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.playlistForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.playlist = data;

    if (this.playlist) {
      this.playlistForm.setValue({
        name: this.playlist.name
      });
    }
  }

  save() {
    if (this.playlist) {
      this.playlist.name = this.playlistForm.value.name;
      this.playlists.put(this.playlist).subscribe(() => {
        this.dialogRef.close();
        this.snack.open('Updated !!', '', {
          duration: 5000
        });
      });
    } else {
      this.playlist = {
        name: this.playlistForm.value.name
      };
      this.playlists.post(this.playlist).subscribe(result => {
        this.dialogRef.close(result);
        this.snack.open('Created !!', '', {
          duration: 5000
        });
      });
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
