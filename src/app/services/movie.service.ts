import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Movie } from '../model/movie';
import { Page } from '../model/page';
import { Tag } from '../model/tag';
import { Filter } from '../model/filter';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);


  public get(id: number = -1, lastOnError = false): Observable<Movie> {
    return this.http.get<Movie>(environment.apiAddr + '/movie/' + id + '?lastOnError=' + lastOnError);
  }

  public getList(filter: Filter): Observable<Page<Movie>> {
    return this.http.get<Page<Movie>>(environment.apiAddr + '/movie/', {params: <any>filter});
  }

  public put(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(environment.apiAddr + '/movie/' + movie.id, movie);
  }

  public post(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(environment.apiAddr + '/movie/', movie);
  }

  public delete(movie: Movie): Observable<Movie> {
    return this.http.delete<Movie>(environment.apiAddr + '/movie/' + movie.id);
  }

  public searchTags(name: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.apiAddr + '/movie/tags/' + name);
  }

}
