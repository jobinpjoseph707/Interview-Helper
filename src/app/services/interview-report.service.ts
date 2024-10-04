import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterviewReportService {
  private apiUrl = 'https://localhost:7042/api/Candidate';

  constructor(private http: HttpClient) {}

  getFilteredInterviewReports(queryParams: any): Observable<any> {
    let params = new HttpParams();
    if (queryParams.name) params = params.set('name', queryParams.name);
    if (queryParams.roleId) params = params.set('roleId', queryParams.roleId);
    if (queryParams.fromDate) params = params.set('fromDate', queryParams.fromDate.toISOString());
    if (queryParams.toDate) params = params.set('toDate', queryParams.toDate.toISOString());

    return this.http.get<any>(this.apiUrl, { params });
  }
}
