import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Playlist } from '../model/playlist';

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(environment.apiAddr + '/playlist');
  }

  public get(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(environment.apiAddr + '/playlist/' + id);
  }

  public post(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(environment.apiAddr + '/playlist/' + playlist.id, playlist);
  }
}
