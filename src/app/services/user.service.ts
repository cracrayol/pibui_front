import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public put(user: User): Observable<User> {
    return this.http.put<User>(environment.apiAddr + '/user/' + user.id, user);
  }

  public changePassword(user: User, oldPassword: String, newPassword: String): Observable<User> {
    return this.http.put<User>(environment.apiAddr + '/user/' + user.id + '/changePassword', {
      oldPassword,
      newPassword
    });
  }

  public delete(user: User): Observable<User> {
    return this.http.delete<User>(environment.apiAddr + '/user/' + user.id);
  }
}
