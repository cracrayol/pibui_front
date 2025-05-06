import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { shareReplay, tap, map } from 'rxjs/operators';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userService = inject(UserService);


  private user: User;

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
    const expiresAt = dayjs().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return dayjs().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return dayjs(expiresAt);
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

  saveUser() {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.userService.put(this.user).subscribe();
  }
}
