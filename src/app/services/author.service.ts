import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Author } from '../model/author';
import { Page } from '../model/page';
import { Filter } from '../model/filter';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);


  public get(filter: Filter): Observable<Page<Author>> {
    return this.http.get<Page<Author>>(environment.apiAddr + '/author/', {params: <any>filter});
  }

  public post(author: Author): Observable<Author> {
    return this.http.post<Author>(environment.apiAddr + '/author/', author);
  }

  public put(author: Author): Observable<Author> {
    return this.http.put<Author>(environment.apiAddr + '/author/' + author.id, author);
  }

  public delete(author: Author): Observable<Author> {
    return this.http.delete<Author>(environment.apiAddr + '/author/' + author.id);
  }

}
