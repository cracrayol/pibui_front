import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Author } from '../model/author';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);


  public get(filter: string, start: number, take: number, sort?: string, order?: string): Observable<Page<Author>> {
    let params = sort !== undefined ? {filter, start, take, sort, order : order !== undefined ? order : 'ASC'} : {filter, start, take};
    return this.http.get<Page<Author>>(environment.apiAddr + '/author/', {params});
  }

  public post(author: Author): Observable<Author> {
    return this.http.post<Author>(environment.apiAddr + '/author/', author);
  }

  public put(author: Author): Observable<Author> {
    return this.http.put<Author>(environment.apiAddr + '/author/' + author.id, author);
  }

  public delete(movie: Author): Observable<Author> {
    return this.http.delete<Author>(environment.apiAddr + '/author/' + movie.id);
  }

}
