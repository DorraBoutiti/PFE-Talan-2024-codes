import { User } from './../models/user.model';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

const API_URL = 'http://localhost:9090/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any;

  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatusChanged = this.authStatus.asObservable();

  constructor(private http: HttpClient, private userService: UserService) { }

  registerManager(data: User): Observable<any> {
    //const headers = new HttpHeaders({"Content-Type": "application/json","Access-Control-Allow-Origin": "http://localhost:8100"});
    return this.http.post<any>(`${API_URL}auth/signup`, data);
  }

  login(registrationNumber: string, password: string): Observable<any> {
    const data = { registrationNumber, password };
    return this.http.post(`${API_URL}auth/signin`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${API_URL}api/users/profile`).pipe(
      tap(profile => {
        this.currentUser = profile;
      })
    );
  }

  getUserRole(): string {
    console.log(this.currentUser?.role);

    return this.currentUser?.role;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
