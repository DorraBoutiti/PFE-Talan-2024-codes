import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model';

const API_URL = 'http://localhost:9090/api/alert/';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private http: HttpClient) { }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${API_URL}`);
  }

  getAlertsByBusinessUnit(bu: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${API_URL}${bu}`);
  }

  addAlert(alert: Alert): Observable<any[]> {
    return this.http.post<Alert[]>(`${API_URL}new`, alert);
  }

  deleteAlert(alertId: number): Observable<any> {
    return this.http.delete(`${API_URL}delete/${alertId}`);
  }
}
