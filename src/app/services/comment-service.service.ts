import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetCommentsApiResponse } from '../types/getCommentType';

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
    return this.http.get<GetCommentsApiResponse>(
      `${this.baseUrl}/getComment/${postType}?postId=${postId}&page=${page}&limit=${limit}`
    );
  }

  postComment(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/postComment/${payload.targetType}/${payload.targetId}`,
      payload,
      { withCredentials: true }
    );
  }
}
