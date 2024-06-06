import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/rag/message';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {
  constructor(private http: HttpClient) { }

  /*getAdvice(): Observable<any> {
    return this.http.get('https://api.adviceslip.com/advice');
  }*/

  sendMessage(userInput: string): Observable<any> {
    const body = { message: userInput };
    return this.http.post<any>(API_URL, body);
  }
}
