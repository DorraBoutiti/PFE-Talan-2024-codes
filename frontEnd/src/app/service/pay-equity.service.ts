import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:9090/api/employee/';

@Injectable({
  providedIn: 'root'
})
export class PayEquityService {
  constructor(private http: HttpClient) { }

  // Performance by Registration Number
  getPerformanceByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${API_URL}employee-performance/${registrationNumber}`);
  }

  // Salary by Registration Number
  getSalaryByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${API_URL}employee-salary/${registrationNumber}`);
  }

  // Attendance by Registration Number
  getAttendanceByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${API_URL}employee-attendance/${registrationNumber}`);
  }

  // Experience by Registration Number
  getExperienceByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${API_URL}employee-experience/${registrationNumber}`);
  }

  // Absenteeism by Registration Number
  getAbsenteeismByRegistrationNumber(registrationNumber: string): Observable<any> {
    return this.http.get(`${API_URL}employee-absenteeism/${registrationNumber}`);
  }

  // ## Post

  // Performance

  getMinPerformanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-performance/min?post=${post}`);
  }

  getMaxPerformanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-performance/max?post=${post}`);
  }

  getMedianPerformanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-performance/median?post=${post}`);
  }

  getFirstQuartilePerformanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-performance/firstQuartile?post=${post}`);
  }

  getThirdQuartilePerformanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-performance/thirdQuartile?post=${post}`);
  }

  // Salary

  getMinSalaryByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-salary/min?post=${post}`);
  }

  getMaxSalaryByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-salary/max?post=${post}`);
  }

  getMedianSalaryByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-salary/median?post=${post}`);
  }

  getFirstQuartileSalaryByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-salary/firstQuartile?post=${post}`);
  }

  getThirdQuartileSalaryByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-salary/thirdQuartile?post=${post}`);
  }

  // Experience

  getMinExperienceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-experience/min?post=${post}`);
  }

  getMaxExperienceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-experience/max?post=${post}`);
  }

  getMedianExperienceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-experience/median?post=${post}`);
  }

  getFirstQuartileExperienceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-experience/firstQuartile?post=${post}`);
  }

  getThirdQuartileExperienceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-experience/thirdQuartile?post=${post}`);
  }

  // Attendance

  getMinAttendanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-attendance/min?post=${post}`);
  }

  getMaxAttendanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-attendance/max?post=${post}`);
  }

  getMedianAttendanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-attendance/median?post=${post}`);
  }

  getFirstQuartileAttendanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-attendance/firstQuartile?post=${post}`);
  }

  getThirdQuartileAttendanceByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-attendance/thirdQuartile?post=${post}`);
  }

  // Absenteeism

  getMinAbsenteeismByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-absenteeism/min?post=${post}`);
  }

  getMaxAbsenteeismByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-absenteeism/max?post=${post}`);
  }

  getMedianAbsenteeismByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-absenteeism/median?post=${post}`);
  }

  getFirstQuartileAbsenteeismByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-absenteeism/firstQuartile?post=${post}`);
  }

  getThirdQuartileAbsenteeismByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-absenteeism/thirdQuartile?post=${post}`);
  }

  // Get Post by Registration Number
  getPostByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.http.get(`${API_URL}post/${registrationNumber}`, { responseType: 'text' });
  }

  // Count Employees by Post
  countByPost(post: string): Observable<any> {
    return this.http.get(`${API_URL}post-count/${post}`);
  }

  // ## BusinessUnit

  // Performance

  getMinPerformanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-performance/min?businessUnit=${businessUnit}`);
  }

  getMaxPerformanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-performance/max?businessUnit=${businessUnit}`);
  }

  getMedianPerformanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-performance/median?businessUnit=${businessUnit}`);
  }

  getFirstQuartilePerformanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-performance/firstQuartile?businessUnit=${businessUnit}`);
  }

  getThirdQuartilePerformanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-performance/thirdQuartile?businessUnit=${businessUnit}`);
  }

  // Salary

  getMinSalaryByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-salary/min?businessUnit=${businessUnit}`);
  }

  getMaxSalaryByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-salary/max?businessUnit=${businessUnit}`);
  }

  getMedianSalaryByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-salary/median?businessUnit=${businessUnit}`);
  }

  getFirstQuartileSalaryByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-salary/firstQuartile?businessUnit=${businessUnit}`);
  }

  getThirdQuartileSalaryByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-salary/thirdQuartile?businessUnit=${businessUnit}`);
  }

  // Experience

  getMinExperienceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-experience/min?businessUnit=${businessUnit}`);
  }

  getMaxExperienceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-experience/max?businessUnit=${businessUnit}`);
  }

  getMedianExperienceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-experience/median?businessUnit=${businessUnit}`);
  }

  getFirstQuartileExperienceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-experience/firstQuartile?businessUnit=${businessUnit}`);
  }

  getThirdQuartileExperienceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-experience/thirdQuartile?businessUnit=${businessUnit}`);
  }

  // Attendance

  getMinAttendanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-attendance/min?businessUnit=${businessUnit}`);
  }

  getMaxAttendanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-attendance/max?businessUnit=${businessUnit}`);
  }

  getMedianAttendanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-attendance/median?businessUnit=${businessUnit}`);
  }

  getFirstQuartileAttendanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-attendance/firstQuartile?businessUnit=${businessUnit}`);
  }

  getThirdQuartileAttendanceByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-attendance/thirdQuartile?businessUnit=${businessUnit}`);
  }

  // Absenteeism

  getMinAbsenteeismByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-absenteeism/min?businessUnit=${businessUnit}`);
  }

  getMaxAbsenteeismByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-absenteeism/max?businessUnit=${businessUnit}`);
  }

  getMedianAbsenteeismByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-absenteeism/median?businessUnit=${businessUnit}`);
  }

  getFirstQuartileAbsenteeismByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-absenteeism/firstQuartile?businessUnit=${businessUnit}`);
  }

  getThirdQuartileAbsenteeismByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-absenteeism/thirdQuartile?businessUnit=${businessUnit}`);
  }

  // Get Business Unit by Registration Number
  getBusinessUnitByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.http.get(`${API_URL}businessUnit/${registrationNumber}`, { responseType: 'text' });
  }

  // Count Employees by Business Unit
  countByBusinessUnit(businessUnit: string): Observable<any> {
    return this.http.get(`${API_URL}businessUnit-count/${businessUnit}`);
  }

  // ## Classification

  // Performance

  getMinPerformanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-performance/min?classification=${classification}`);
  }

  getMaxPerformanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-performance/max?classification=${classification}`);
  }

  getMedianPerformanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-performance/median?classification=${classification}`);
  }

  getFirstQuartilePerformanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-performance/firstQuartile?classification=${classification}`);
  }

  getThirdQuartilePerformanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-performance/thirdQuartile?classification=${classification}`);
  }

  // Salary

  getMinSalaryByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-salary/min?classification=${classification}`);
  }

  getMaxSalaryByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-salary/max?classification=${classification}`);
  }

  getMedianSalaryByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-salary/median?classification=${classification}`);
  }

  getFirstQuartileSalaryByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-salary/firstQuartile?classification=${classification}`);
  }

  getThirdQuartileSalaryByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-salary/thirdQuartile?classification=${classification}`);
  }

  // Experience

  getMinExperienceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-experience/min?classification=${classification}`);
  }

  getMaxExperienceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-experience/max?classification=${classification}`);
  }

  getMedianExperienceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-experience/median?classification=${classification}`);
  }

  getFirstQuartileExperienceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-experience/firstQuartile?classification=${classification}`);
  }

  getThirdQuartileExperienceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-experience/thirdQuartile?classification=${classification}`);
  }

  // Attendance

  getMinAttendanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-attendance/min?classification=${classification}`);
  }

  getMaxAttendanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-attendance/max?classification=${classification}`);
  }

  getMedianAttendanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-attendance/median?classification=${classification}`);
  }

  getFirstQuartileAttendanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-attendance/firstQuartile?classification=${classification}`);
  }

  getThirdQuartileAttendanceByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-attendance/thirdQuartile?classification=${classification}`);
  }

  // Absenteeism

  getMinAbsenteeismByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-absenteeism/min?classification=${classification}`);
  }

  getMaxAbsenteeismByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-absenteeism/max?classification=${classification}`);
  }

  getMedianAbsenteeismByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-absenteeism/median?classification=${classification}`);
  }

  getFirstQuartileAbsenteeismByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-absenteeism/firstQuartile?classification=${classification}`);
  }

  getThirdQuartileAbsenteeismByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-absenteeism/thirdQuartile?classification=${classification}`);
  }

  // Get Classification by Registration Number
  getClassificationByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.http.get(`${API_URL}classification/${registrationNumber}`, { responseType: 'text' });
  }

  // Count Employees by Classification
  countByClassification(classification: string): Observable<any> {
    return this.http.get(`${API_URL}classification-count/${classification}`);
  }
}
