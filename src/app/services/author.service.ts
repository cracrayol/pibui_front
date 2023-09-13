import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Author } from '../model/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http: HttpClient) { }

  public put(author: Author): Observable<Author> {
    return this.http.put<Author>(environment.apiAddr + '/author/' + author.id, author);
  }

  public get(name: string): Observable<Author[]> {
    return this.http.get<Author[]>(environment.apiAddr + '/author/search/' + name);
  }

  getList(start: number, take: number, sort?: string, order?: string): Observable<Author[]> {
    let params = sort !== undefined ? {start, take, sort, order : order !== undefined ? order : 'ASC'} : {start, take};
    return this.http.get<Author[]>(environment.apiAddr + '/author/', {params});
  }

  public delete(movie: Author): Observable<Author> {
    return this.http.delete<Author>(environment.apiAddr + '/author/' + movie.id);
  }

}
