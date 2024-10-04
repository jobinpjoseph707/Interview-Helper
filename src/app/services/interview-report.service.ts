import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterviewReportService {
  private apiUrl = 'https://localhost:7042/api/Candidate';

  constructor(private http: HttpClient) {}

  getFilteredInterviewReports(queryParams: any): Observable<any> {
    let params = new HttpParams();

    if (queryParams.name) {
      params = params.set('name', queryParams.name);
    }

    // Safely handle fromDate and set it to the start of the day (00:00:00)
    if (queryParams.fromDate) {
      const fromDate = new Date(queryParams.fromDate);
      if (!isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0); // Start of the day
        params = params.set('fromDate', fromDate.toISOString());
      }
    }

    // Safely handle toDate and set it to the end of the day (23:59:59)
    if (queryParams.toDate) {
      const toDate = new Date(queryParams.toDate);
      if (!isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999); // End of the day
        params = params.set('toDate', toDate.toISOString());
      }
    }

    if (queryParams.roleId) {
      params = params.set('roleId', queryParams.roleId);
    }

    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError) // Add error handling here
      );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('A client-side error occurred:', error.error.message);
    } else {

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }


    return throwError(() => new Error('Something went wrong with the request. Please try again later.'));
  }
}
