import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { debounceTime, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pbi-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements AfterViewInit {

  // TODO Lazy loading of the list

  $data: Observable<any>;
  showLatest = false;
  searching = false;
  @ViewChild('searchValue') searchField: ElementRef;
  @Input() selectionIcon: string;
  @Output() itemSelected = new EventEmitter<number>();

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngAfterViewInit() {
    fromEvent(this.searchField.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((data: any) => {
      this.search(this.searchField.nativeElement.value);
    });

    // Load latest movies
    this.$data = this.http.get(environment.apiAddr + '/movie/latest').pipe(tap(() => {
      this.showLatest = true;
    }));
  }

  /**
   * Run the search
   */
  search(search) {
    if (search.length >= 3 || search.length === 0) {
      this.showLatest = false;
      this.searching = true;
      let url = '/movie/latest';
      if (search.length >= 3) {
        url = '/search/' + search;
      }
      this.$data = this.http.get(environment.apiAddr + url).pipe(tap(() => {
        this.showLatest = search.length === 0;
        this.searching = false;
      }));
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
