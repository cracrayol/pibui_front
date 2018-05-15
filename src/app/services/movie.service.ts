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

}
