import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap, map } from 'rxjs/operators';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { PlaylistService } from './playlist.service';

@Injectable()
export class AuthService {

  private user: User;

  constructor(private http: HttpClient, private playlist: PlaylistService) {
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiAddr + '/login', { email, password })
      .pipe(tap(res => this.setSession(res)), map((res: any) => res.user), shareReplay());
  }

  register(email: string, password: string) {
    return this.http.post<User>(environment.apiAddr + '/register', { email, password })
      // this is just the HTTP call,
      // we still need to handle the reception of the token
      .pipe(shareReplay());
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getUser(): User {
    if (!this.isLoggedIn()) {
      return null;
    }
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    return this.user;
  }
}
