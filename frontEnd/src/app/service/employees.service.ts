import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

const FLASK_API_URL = 'http://localhost:5000/api/';
const SPRING_API_URL = 'http://localhost:9090/api/employee/';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) { }

  // Flask Endpoints

  getSalaryReview(): Observable<any> {
    return this.http.get(`${FLASK_API_URL}employees`);
  }

  getEmployeesNeedAugmentation(): Observable<any> {
    return this.http.get(`${FLASK_API_URL}employees/need`);
  }

  getChurnRisk(): Observable<any> {
    return this.http.get(`${FLASK_API_URL}churn-risk`);
  }

  getChurnRiskByBusinessUnit(): Observable<any> {
    return this.http.get<any>(`${FLASK_API_URL}churn-risk/business-unit`);
  }

  getBenchmarkingAnalysis(poste: string, experience: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { poste, experience };
    console.log(body);
    return this.http.post<any>(`${FLASK_API_URL}llm/benchmarking`, body, { headers });
  }

  // Spring Endpoints

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${SPRING_API_URL}`);
  }

  getEmployeeByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${SPRING_API_URL}${registrationNumber}`);
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`${SPRING_API_URL}id/${id}`);
  }
}
