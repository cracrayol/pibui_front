import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);


  public put(user: User): Observable<User> {
    return this.http.put<User>(environment.apiAddr + '/user/' + user.id, user);
  }

  public delete(user: User): Observable<User> {
    return this.http.delete<User>(environment.apiAddr + '/user/' + user.id);
  }
}
