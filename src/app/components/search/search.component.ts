import { Component, AfterViewInit, ElementRef, inject, output, viewChild } from '@angular/core';
import { debounceTime, tap } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { Page } from 'src/app/model/page';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Movie } from 'src/app/model/movie';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SearchHelpComponent } from '../search-help/search-help.component';

@Component({
    selector: 'pbi-search',
    templateUrl: './search.component.html',
    imports: [MatInputModule, MatTabsModule, MatListModule, MatProgressSpinnerModule, CommonModule, MatIconModule]
})
export class SearchComponent implements AfterViewInit {
  private movieService = inject(MovieService);
  private dialog = inject(MatDialog);

  $data: Observable<Page<Movie>> = this.movieService.getList('', 0, 100, 'movie.id', 'DESC');
  showLatest = true;
  searching = false;
  searchField = viewChild<ElementRef<HTMLInputElement>>('searchValue');
  itemSelected = output<number>();

  ngAfterViewInit() {
    fromEvent(this.searchField().nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((data: any) => {
      this.search(this.searchField().nativeElement.value);
    });
  }

  /**
   * Run the search
   */
  search(search) {
    this.searching = true;
    this.$data = this.movieService.getList(search.length >= 3 ? search : '', 0, 100, 'movie.title', 'ASC').pipe(tap(() => {
      this.showLatest = search.length < 3;
      this.searching = false;
    }));
  }

  /**
   * Play the given movie
   * @param id The movie ID
   * @todo Make smooth scroll to top
   */
  play(id: number) {
    this.itemSelected.emit(id);
  }

  showHelp() {
    this.dialog.open(SearchHelpComponent);
  }

}
