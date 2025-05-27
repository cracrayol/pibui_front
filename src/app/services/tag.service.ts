import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);


  public get(filter: string, start: number, take: number, sort?: string, order?: string): Observable<Page<Tag>> {
    let params = sort !== undefined ? {filter, start, take, sort, order : order !== undefined ? order : 'ASC'} : {filter, start, take};
    return this.http.get<Page<Tag>>(environment.apiAddr + '/tag/', {params});
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
