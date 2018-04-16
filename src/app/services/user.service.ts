import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  public put(user: User): Observable<User> {
    return this.http.put<User>(environment.apiAddr + '/user/' + user.id, user);
  }
}
