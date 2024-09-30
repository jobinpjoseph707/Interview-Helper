// src/app/services/stack.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, catchError, throwError, map } from 'rxjs';
import { Stack } from '../Models/stack';

@Injectable({
  providedIn: 'root',
})
export class StackService {
  private apiTechnologyUrl = 'https://localhost:7042/api/Technology';
  private apiExperienceLevelUrl = 'https://localhost:7042/api/ExperienceLevel';
  private apiRoleUrl='https://localhost:7042/api/ApplicationRole';

  constructor(private http: HttpClient) {}

  // Fetch the stacks from the APIs
  getStacks(): Observable<Stack[]> {
    return forkJoin({
      technologies: this.http.get<{ name: string }[]>(this.apiTechnologyUrl), // Fetch technologies
      experienceLevels: this.http.get<{ level: string }[]>(this.apiExperienceLevelUrl) // Fetch experience levels
    }).pipe(
      catchError((error) => {
        console.error('Error fetching stack options', error);
        return throwError(() => new Error('Error fetching stack options.'));
      }),
      // Transform the response into the desired format
      map((responses) => {
        const experienceLevels = responses.experienceLevels.map(el => el.level); // Extract the level property
        return responses.technologies.map(tech => ({
          technology: tech.name, // Extract the technology name
          experienceLevels: experienceLevels // Use the extracted experience levels for each technology
        }));
      })
    );
  }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRoleUrl).pipe(
      catchError((error) => {
        console.error('Error fetching role options', error);
        return throwError(() => new Error('Error fetching role options.'));
      })
    );
  }
}
