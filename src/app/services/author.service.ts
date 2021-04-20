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

}
