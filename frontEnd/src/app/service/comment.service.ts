import { Comment } from './../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const SPRING_API_URL = 'http://localhost:9090/api/comment/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) { }

  getCommentsByEmployee(registrationNumber: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${SPRING_API_URL}${registrationNumber}`);
  }

  addFeedback(comment: Comment): Observable<any> {
    return this.http.post(`${SPRING_API_URL}new`, comment);
  }

  getCommentsCountByEmployee(registrationNumber: string): Observable<number> {
    return this.http.get<number>(`${SPRING_API_URL}employee-count/${registrationNumber}`);
  }
}
