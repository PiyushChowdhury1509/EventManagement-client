import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentServiceService {
  private baseUrl = 'http://localhost:3000/api/v1/comment';

  constructor(private http: HttpClient) {}

  getComments(
    postType: string,
    postId: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/:${postType}?postId=${postId}&page=${page}&limit=${limit}`
    );
  }
}
