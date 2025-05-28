import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, inject, input, model, viewChild, ViewChild } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, fromEvent } from 'rxjs';
import { Tag } from 'src/app/model/tag';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-tag-autocomplete',
  imports: [MatChipsModule, MatIconModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule],
  templateUrl: './tag-autocomplete.component.html'
})
export class TagAutocompleteComponent implements AfterViewInit {
  private movieService = inject(MovieService);

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList: Tag[];
  tags = model.required<Tag[]>();
  allowNew = input(false);
  placeholder = input.required<string>();
  tagInput = viewChild<ElementRef<HTMLInputElement>>('tagInput');

  ngAfterViewInit(): void {
    fromEvent(this.tagInput().nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(() => {
      this.tagsList = [];
      if (this.tagInput().nativeElement.value.length >= 2) {
        this.movieService.searchTags(this.tagInput().nativeElement.value)
          .subscribe(data => {
            this.tagsList = data;
          });
      }
    });
  }

  addTag(event) {
    if (event.option) {
      this.tags().push(event.option.value);
      event.option.deselect();
    } else if (this.allowNew() && event.value) {
      this.tags().push({ id: null, name: event.value });
      this.tagInput().nativeElement.value = '';
    }
    this.tagsList = [];
  }

  removeTag(event) {
    this.tags().splice(this.tags().indexOf(event), 1);
  }

}
