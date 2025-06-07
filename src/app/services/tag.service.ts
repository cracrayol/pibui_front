import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { Tag } from '../model/tag';
import { Filter } from '../model/filter';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);


  public get(filter: Filter): Observable<Page<Tag>> {
    return this.http.get<Page<Tag>>(environment.apiAddr + '/tag/', {params: <any>filter});
  }

  public post(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(environment.apiAddr + '/tag/', tag);
  }

  public put(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(environment.apiAddr + '/tag/' + tag.id, tag);
  }

  public delete(tag: Tag): Observable<Tag> {
    return this.http.delete<Tag>(environment.apiAddr + '/tag/' + tag.id);
  }

}
