import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { Author } from 'src/app/model/author';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthorService } from 'src/app/services/author.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/model/tag';

@Component({
  selector: 'pbi-movie-dialog',
  templateUrl: './movie-dialog.component.html'
})
export class MovieDialogComponent {

  movieForm: UntypedFormGroup;
  movie: Movie;
  filteredAuthors: Author[] = [];
  isLoading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList: Observable<Tag[]>;

  constructor(private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<MovieDialogComponent>, private movies: MovieService, private authors: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      author: ['', Validators.required],
      linkId: ['', Validators.required],
      valid: '',
      tags: ''
    });

    this.tagsList = this.movieForm.get('tags').valueChanges.pipe(
      startWith(null),
    );

    this.movieForm
      .get('author')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => {
          if ((<string>value).length >= 3) {
            return this.authors.get(value)
              .pipe(
                finalize(() => this.isLoading = false),
              )
          }
          this.isLoading = false;
          return [];
        })
      ).subscribe(authors => this.filteredAuthors = authors);

    this.movie = data;

    if (this.movie) {
      this.movieForm.setValue({
        title: this.movie.title,
        subtitle: this.movie.subtitle,
        author: this.movie.author,
        linkId: this.movie.linkId,
        valid: this.movie.valid,
        tags: this.movie.tags
      });
    }
  }

  save() {
    if (this.movie) {
      this.movie.title = this.movieForm.value.title;
      this.movie.subtitle = this.movieForm.value.subtitle;
      this.movie.linkId = this.movieForm.value.linkId;
      this.movie.valid = this.movieForm.value.valid;
      this.movie.tags = this.movieForm.value.tags;

      if (typeof this.movieForm.value.author === 'string' || this.movieForm.value.author instanceof String) {
        // TODO Create author
      } else {
        this.movie.author = this.movieForm.value.author;
      }

      this.movies.put(this.movie).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Updated !!`, '', {
          duration: 5000
        });
      });
    }/* else {
      this.playlist = {
        name: this.playlistForm.value.name,
        public: this.playlistForm.value.public
      };

      this.playlists.post(this.playlist).subscribe(result => {
        this.dialogRef.close(result);
        this.snack.open($localize`Created !!`, '', {
          duration: 5000
        });
      });
    }*/
  }

  displayAuthor(author: Author) {
    if (author) { return author.name; }
  }

  addTag(event) {

  }

}
