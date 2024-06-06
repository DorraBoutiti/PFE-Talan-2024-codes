import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

const API_URL = 'http://localhost:9090/notification/';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) { }

  getNotificationsByUserId(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}${userId}`);
  }

  getFirstSevenNotificationsByUserId(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}limited/${userId}`);
  }

  getNotificationsByUserIdNotRead(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_URL}new/${userId}`);
  }

  countByUserToIdAndReadFalse(userId: number): Observable<any> {
    return this.http.get(`${API_URL}new/count/${userId}`);
  }

  changeNotifStatusToRead(userId: number): Observable<any> {
    return this.http.patch(`${API_URL}read/${userId}`, null);
  }

  subscribeToEventSource(userId: number, callback: Function) {
    const urlEndPoint = `${API_URL}subscribe?userID=${userId}`;
    const eventSource = new EventSource(urlEndPoint);
    eventSource.addEventListener("notifications", (event: any) => {
      callback(event);
    });
    eventSource.addEventListener("notificationCount", (event: any) => {
      //callback(event);
      this.handleNotificationCount(event);
    });
    eventSource.addEventListener("error", (event: any) => {
      console.log("Error : " + event.currentTarget.readyState)
      if(event.currentTarget.readyState == EventSource.CLOSED) { // L'EventSource est fermée, rien à faire
      } else {
        eventSource.close(); // Fermer l'EventSource en cas d'erreur
      }
    });
    window.onbeforeunload = () => {
      eventSource.close(); // Fermer l'EventSource lorsque la fenêtre se ferme
    };
  }

  private notificationCountDataSubject = new BehaviorSubject<number>(0);
  notificationCountData$: Observable<number> = this.notificationCountDataSubject.asObservable();

  handleNotificationCount(event: any): void {
    console.log("Notification Count Event :", event.data);
    this.updateNotificationCountData(event.data);
  }

  updateNotificationCountData(data: number) {
    this.notificationCountDataSubject.next(data);
  }
}
