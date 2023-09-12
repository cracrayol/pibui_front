import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Movie } from '../model/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  get(id: number = -1): Observable<Movie> {
    return this.http.get<Movie>(environment.apiAddr + '/movie/' + id);
  }

  getList(start: number, take: number, sort?: string, order?: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(environment.apiAddr + '/movie/', {params: {start, take, sort, order}});
  }

  public put(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(environment.apiAddr + '/movie/' + movie.id, movie);
  }

  public delete(movie: Movie): Observable<Movie> {
    return this.http.delete<Movie>(environment.apiAddr + '/movie/' + movie.id);
  }

}
