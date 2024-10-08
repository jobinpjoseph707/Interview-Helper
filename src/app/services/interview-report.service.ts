import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewReportService {
  private apiUrl = `${environment.apiUrl}/Candidate`;  // Use API URL from environment

  constructor(private http: HttpClient) {}

  getFilteredInterviewReports(queryParams: any): Observable<any> {
    let params = new HttpParams();

    if (queryParams.name) {
      params = params.set('name', queryParams.name);
    }

    if (queryParams.fromDate) {
      const fromDate = new Date(queryParams.fromDate);
      if (!isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0);
        params = params.set('fromDate', fromDate.toISOString());
      }
    }

    if (queryParams.toDate) {
      const toDate = new Date(queryParams.toDate);
      if (!isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        params = params.set('toDate', toDate.toISOString());
      }
    }

    if (queryParams.roleId) {
      params = params.set('roleId', queryParams.roleId);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}

