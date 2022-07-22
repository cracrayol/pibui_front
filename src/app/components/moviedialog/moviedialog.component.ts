import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { Author } from 'src/app/model/author';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'pbi-moviedialog',
  templateUrl: './moviedialog.component.html',
  styleUrls: ['./moviedialog.component.scss']
})
export class MovieDialogComponent {

  movieForm: UntypedFormGroup;
  movie: Movie;
  filteredAuthors: Author[] = [];
  isLoading = false;

  constructor(private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<MovieDialogComponent>, private movies: MovieService, private authors: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      author: ['', Validators.required],
      linkId: ['', Validators.required],
      valid: ''
    });

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
        valid: this.movie.valid
      });
    }
  }

  save() {
    if (this.movie) {
      this.movie.title = this.movieForm.value.title;
      this.movie.subtitle = this.movieForm.value.subtitle;
      this.movie.linkId = this.movieForm.value.linkId;
      this.movie.valid = this.movieForm.value.valid;

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

}
