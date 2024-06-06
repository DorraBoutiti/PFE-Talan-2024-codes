import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessUnit } from '../models/businessUnit.model';

const API_URL = 'http://localhost:9090/api/businessUnit/';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {
  constructor(private http: HttpClient) { }

  getBusinessUnits(): Observable<BusinessUnit[]> {
    return this.http.get<BusinessUnit[]>(`${API_URL}`);
  }

  getBusinessUnit(bu: string): Observable<BusinessUnit> {
    return this.http.get<BusinessUnit>(`${API_URL}${bu}`);
  }
}
