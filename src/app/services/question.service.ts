import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionRequest, RoleResult } from '../Models/questions.interface'; // Import your response interface

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'https://localhost:7042/api/questions'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch questions based on candidateId and technologies
  getQuestions(candidateId: number, technologies: { technologyId: number; experienceLevelId: number }[]): Observable<RoleResult[]> {
    const requestBody: QuestionRequest = {
      candidateId,
      technologies
    };

    return this.http.post<RoleResult[]>(`${this.apiUrl}/get-questions`, requestBody);
  }
}
