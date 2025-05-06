import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Playlist } from '../model/playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private http = inject(HttpClient);


  public getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(environment.apiAddr + '/playlist');
  }

  public get(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(environment.apiAddr + '/playlist/' + id);
  }

  public put(playlist: Playlist): Observable<Playlist> {
    return this.http.put<Playlist>(environment.apiAddr + '/playlist/' + playlist.id, playlist);
  }

  public post(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(environment.apiAddr + '/playlist', playlist);
  }

  public delete(playlist: Playlist): Observable<Playlist> {
    return this.http.delete<Playlist>(environment.apiAddr + '/playlist/' + playlist.id);
  }
}
