import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private http: HttpClient) {}

  private url = 'http://localhost:3000/api/v1/like';

  handleLike(
    like: boolean,
    contentType: string,
    contentId: string
  ): Observable<any> {
    return this.http.post(
      `${this.url}/${like}/${contentType}/${contentId}`,
      {},
      { withCredentials: true }
    );
  }
}
