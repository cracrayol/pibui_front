import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Author } from 'src/app/model/author';
import { Movie } from 'src/app/model/movie';
import { Tag } from 'src/app/model/tag';
import { AuthorService } from 'src/app/services/author.service';
import { MovieService } from 'src/app/services/movie.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'pbi-movie-dialog',
  templateUrl: './movie-dialog.component.html',
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule]
})
export class MovieDialogComponent {

  movieForm: UntypedFormGroup;
  movie: Movie;
  filteredAuthors: Author[] = [];
  isLoading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList: Tag[];
  currentTag = '';

  constructor(private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<MovieDialogComponent>, private movies: MovieService, private authors: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      author: ['', Validators.required],
      linkId: ['', Validators.required],
      tags: '',
      tag: ''
    });

    this.movieForm.get('tag').valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => {
        if (value.length >= 3) {
          return this.movies.searchTags(value)
            .pipe(
              finalize(() => this.isLoading = false),
            )
        }
        this.isLoading = false;
        return [];
      })
    ).subscribe(tags => this.tagsList = tags);

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

    if (this.movie != null) {
      this.movieForm.setValue({
        title: this.movie.title,
        subtitle: this.movie.subtitle,
        author: this.movie.author,
        linkId: this.movie.linkId,
        tags: this.movie.tags,
        tag: ''
      });
    } else {
      this.movie = new Movie();
    }
  }

  save() {
    this.movie.title = this.movieForm.value.title;
    this.movie.subtitle = this.movieForm.value.subtitle;
    this.movie.linkId = this.movieForm.value.linkId;
    this.movie.tags = this.movieForm.value.tags;

    if (typeof this.movieForm.value.author === 'string' || this.movieForm.value.author instanceof String) {
      this.movie.author = {name: this.movieForm.value.author};
    } else {
      this.movie.author = this.movieForm.value.author;
    }

    // TODO error management
    if (this.movie.id != null) {
      this.movies.put(this.movie).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Updated !!`, '', {
          duration: 5000
        });
      });
    } else {
      this.movies.post(this.movie).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Created !!`, '', {
          duration: 5000
        });
      });
    }
  }

  displayAuthor(author: Author) {
    if (author) { return author.name; }
  }

  addTag(event) {
    if(event.option) {
      this.movieForm.patchValue({tags : [...this.movieForm.get('tags').value, event.option.value], tag: ''});
      this.movie.tags = this.movieForm.get('tags').value;
      event.option.deselect();
    } else if(event.value) {
      this.movieForm.patchValue({tags : [...this.movieForm.get('tags').value, {id: null, name: event.value}], tag: ''});
      this.movie.tags = this.movieForm.get('tags').value;
    }
  }

  removeTag(event) {
    this.movie.tags.splice(this.movie.tags.indexOf(event), 1);
    this.movieForm.patchValue({tags : this.movie.tags, tag: ''});
  }

}
