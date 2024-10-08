import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionRequest, RoleResult } from '../Models/questions.interface'; // Import your response interface
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/Questions`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch questions based on candidateId and technologies
  getQuestions(candidateName: string, candidateId: number, technologies: { technologyId: number; experienceLevelId: number }[]): Observable<RoleResult[]> {
    const requestBody: QuestionRequest = {
      candidateName,
      candidateId,
      technologies
    };

    return this.http.post<RoleResult[]>(`${this.apiUrl}/get-questions`, requestBody);
  }

  // Method to update candidate's overall score
  updateCandidateScore(candidateId: number, overallScore: number, review: string): Observable<string> {
    const requestBody = {
      candidateId,
      overallScore,
      review
    };

    return this.http.post(`${this.apiUrl}/update-candidate-score`, requestBody, {
      responseType: 'text',
    });
  }

  // Method to update scores for individual technologies
  updateTechnologyScores(candidateId: number, technologyScores: { [technologyId: number]: number }): Observable<string> {
    const requestBody = {
      candidateId,
      technologyScores
    };

    return this.http.post(`${this.apiUrl}/update-technology-scores`, requestBody, {
      responseType: 'text',
    });
  }
}
