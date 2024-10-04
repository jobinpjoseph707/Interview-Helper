import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateFormService {
  private apiUrl = 'https://localhost:7042/api';

  constructor(private http: HttpClient) {}

  submitCandidate(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Candidate`, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<any> => {
    let errorMessage: any;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = { message: "Client-side error", details: error.error.message };
    } else {
      // Server-side error
      try {

        errorMessage = JSON.parse(error.error);
      } catch (e) {

        errorMessage = this.convertToValidJson(error.error);
      }
    }

    console.error('Error occurred:', errorMessage);
    return of(errorMessage); 
  };

  private convertToValidJson(response: any): any {

    const responseString = response.toString();


    return {
      message: "Internal Server Error",
      details: responseString.includes("System.Exception") ? responseString : "Unknown error occurred"
    };
  }
}
