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
  private apiRoleUrl = 'https://localhost:7042/api/ApplicationRole';

  constructor(private http: HttpClient) {}

  getStacks(): Observable<Stack[]> {
    return forkJoin({
      technologies: this.http.get<{ technologyId: number; name: string }[]>(this.apiTechnologyUrl), // Fetch technologies
      experienceLevels: this.http.get<{ experienceLevelId: number; level: string }[]>(this.apiExperienceLevelUrl) // Fetch experience levels
    }).pipe(
      catchError((error) => {
        console.error('Error fetching stack options', error);
        return throwError(() => new Error('Error fetching stack options.'));
      }),
      // Transform the response into the desired format
      map((responses) => {
        // Check the response for debugging
        console.log('Technologies Response:', responses.technologies);
        console.log('Experience Levels Response:', responses.experienceLevels);

        // Extract experience levels from the response
        const experienceLevels = responses.experienceLevels.map(el => ({
          id: el.experienceLevelId,  // Use experienceLevelId instead of id
          level: el.level
        }));

        // Map technologies to the desired structure, including IDs
        return responses.technologies.map(tech => ({
          technologyId: tech.technologyId, // Extract technology ID
          technology: tech.name, // Use the name property directly
          experienceLevels: experienceLevels // Assign the complete experience levels list
        }));
      })
    );
  }





  // Fetch roles from the role API
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRoleUrl).pipe(
      catchError((error) => {
        console.error('Error fetching role options', error);
        return throwError(() => new Error('Error fetching role options.'));
      })
    );
  }
}
