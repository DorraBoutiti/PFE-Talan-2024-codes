import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:9090/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  private profileUpdatedSource = new Subject<void>();

  profileUpdated$ = this.profileUpdatedSource.asObservable();

  emitProfileUpdated() {
    this.profileUpdatedSource.next();
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${API_URL}api/users/profile`);
  }

  getUsersWithoutPassword(): Observable<any> {
    return this.http.get(`${API_URL}api/users/without-password`);
  }

  getActiveUsers(userID: number): Observable<any> {
    return this.http.get(`${API_URL}api/users/active/${userID}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${API_URL}api/users/email/${email}`);
  }

  provideAccessToUser(id: number): Observable<any> {
    return this.http.post(`${API_URL}api/users/access/${id}`, null);
  }

  addUser(data: User): Observable<any> {
    //const headers = new HttpHeaders({"Content-Type": "application/json","Access-Control-Allow-Origin": "http://localhost:8100"});
    return this.http.post<any>(`${API_URL}api/users/add`, data);
  }

  /*updateUser(updateRequest: any) : Observable<any> {
    return this.http.put(`${API_URL}api/users`, updateRequest);
  }*/

  updateUserPassword(updateRequest: any) : Observable<any> {
    return this.http.put(`${API_URL}api/users/password`, updateRequest);
  }

  updateUser(updateRequest: any) : Observable<any> {
    return this.http.put(`${API_URL}api/users`, updateRequest);
  }

  updateUserEmail(updateRequest: any) : Observable<any> {
    return this.http.put(`${API_URL}api/users/email`, updateRequest);
  }

  rejectUserRequest(id: number) : Observable<any> {
    return this.http.put(`${API_URL}api/users/reject/${id}`, null);
  }

  disableAccount(id: number) : Observable<any> {
    return this.http.put(`${API_URL}api/users/disable/${id}`, null);
  }
}
