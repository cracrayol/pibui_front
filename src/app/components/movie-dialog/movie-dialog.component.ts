import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { TagAutocompleteComponent } from 'src/app/components/tag-autocomplete/tag-autocomplete.component';
import { Author } from 'src/app/model/author';
import { Filter } from 'src/app/model/filter';
import { Movie } from 'src/app/model/movie';
import { Tag } from 'src/app/model/tag';
import { AuthService } from 'src/app/services/auth.service';
import { AuthorService } from 'src/app/services/author.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
    selector: 'pbi-movie-dialog',
    templateUrl: './movie-dialog.component.html',
    imports: [TagAutocompleteComponent, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
      MatButtonModule, MatAutocompleteModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule]
})
export class MovieDialogComponent {

  movieForm: FormGroup;
  filteredAuthors: Author[] = [];
  isLoading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList: Tag[];
  currentTag = '';

  movie = inject<Movie>(MAT_DIALOG_DATA);
  movieService = inject(MovieService);
  authorService = inject(AuthorService);
  authService = inject(AuthService);
  snack = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<MovieDialogComponent>);
  fb = inject(FormBuilder);

  constructor() {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      author: ['', Validators.required],
      linkId: ['', Validators.required],
      validated: '',
      tag: ''
    });

    this.movieForm.get('tag').valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => {
        if (value.length >= 3) {
          return this.movieService.searchTags(value)
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
            const filter: Filter = {
              filter: value,
              start: 0,
              take: 25,
              sort: 'name',
              order: 'ASC'
            };
            return this.authorService.get(filter)
              .pipe(
                finalize(() => this.isLoading = false),
              )
          }
          this.isLoading = false;
          return [];
        })
      ).subscribe(authors => this.filteredAuthors = authors.data);

    if (this.movie != null) {
      this.movieForm.setValue({
        title: this.movie.title,
        subtitle: this.movie.subtitle,
        author: this.movie.author,
        linkId: this.movie.linkId,
        validated: this.movie.validated,
        tag: ''
      });
    } else {
      this.movie = new Movie();
      this.movie.tags = [];
      this.movieForm.patchValue({validated: this.authService.getUser().isAdmin});
    }
  }

  save() {
    this.movie.title = this.movieForm.value.title;
    this.movie.subtitle = this.movieForm.value.subtitle;
    this.movie.linkId = this.movieForm.value.linkId;
    this.movie.validated = this.movieForm.value.validated;

    if (typeof this.movieForm.value.author === 'string' || this.movieForm.value.author instanceof String) {
      this.movie.author = {name: this.movieForm.value.author};
    } else {
      this.movie.author = this.movieForm.value.author;
    }

    // TODO error management
    if (this.movie.id != null) {
      this.movieService.put(this.movie).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Movie successfully updated.`, '', {
          duration: 5000
        });
      });
    } else {
      this.movieService.post(this.movie).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.snack.open($localize`Movie successfully created.`, '', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          },
          error: (error: HttpErrorResponse) => {
            if(error.error.code == 'ER_DUP_ENTRY') {
              this.snack.open($localize`⚠️ Movie already in database (maybe disabled).`, '', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            }
          }
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
