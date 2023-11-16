import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { Page } from 'src/app/model/page';
import { Movie } from 'src/app/model/movie';

@Component({
  selector: 'pbi-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements AfterViewInit, OnInit {

  // TODO Lazy loading of the list

  $data: Observable<Page<any>>;
  showLatest = false;
  searching = false;
  @ViewChild('searchValue', { static: true }) searchField: ElementRef<HTMLInputElement>;
  @Input() selectionIcon: string;
  @Output() itemSelected = new EventEmitter<number>();

  constructor(private http: HttpClient, private route: ActivatedRoute, private movies: MovieService) { }

  ngOnInit(): void {
    // Load latest movies
    this.$data = this.movies.getList(0, 30);
  }

  ngAfterViewInit() {
    fromEvent(this.searchField.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((data: any) => {
      this.search(this.searchField.nativeElement.value);
    });
  }

  /**
   * Run the search
   */
  search(search) {
    if (search.length >= 3) {
      this.showLatest = false;
      this.searching = true;
      let url = '/search/' + search;
      this.$data = this.http.get<Page<Movie>>(environment.apiAddr + url).pipe(tap(() => {
        this.showLatest = search.length === 0;
        this.searching = false;
      }));
    } else if(search.length === 0) {
      this.$data = this.movies.getList(0, 30);
    }
  }

  /**
   * Play the given movie
   * @param id The movie ID
   * @todo Make smooth scroll to top
   */
  play(id: number) {
    this.itemSelected.emit(id);
  }

}
