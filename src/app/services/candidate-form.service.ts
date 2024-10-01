import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CandidateFormService {
  private apiUrl = 'https://your-backend-api-url.com/api';

  constructor(private http: HttpClient) {}

  submitCandidate(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/candidates`, data);
  }
}
