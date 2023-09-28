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

  public get(id: number = -1): Observable<Movie> {
    return this.http.get<Movie>(environment.apiAddr + '/movie/' + id);
  }

  public getList(start: number, take: number, sort?: string, order?: string, all?: boolean): Observable<Movie[]> {
    let params = sort !== undefined ? {start, take, sort, order : order !== undefined ? order : 'ASC', all} : {start, take, all};
    return this.http.get<Movie[]>(environment.apiAddr + '/movie/', {params});
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

}
