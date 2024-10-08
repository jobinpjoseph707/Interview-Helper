import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Stack } from '../Models/stack';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root',
})
export class StackService {
  private apiTechnologyUrl = `${environment.apiUrl}/Technology`;
  private apiExperienceLevelUrl = `${environment.apiUrl}/ExperienceLevel`;
  private apiRoleUrl = `${environment.apiUrl}/ApplicationRole`;

  constructor(private http: HttpClient) {}

  // Fetch stacks, which includes technologies and experience levels
  getStacks(): Observable<Stack[]> {
    return forkJoin({
      technologies: this.http.get<{ technologyId: number; name: string }[]>(this.apiTechnologyUrl), // Fetch technologies
      experienceLevels: this.http.get<{ experienceLevelId: number; level: string }[]>(this.apiExperienceLevelUrl) // Fetch experience levels
    }).pipe(
      map((responses: { technologies: { technologyId: number; name: string }[]; experienceLevels: { experienceLevelId: number; level: string }[] }) => {
        console.log('Technologies Response:', responses.technologies);
        console.log('Experience Levels Response:', responses.experienceLevels);

        // Extract experience levels from the response
        const experienceLevels = responses.experienceLevels.map(el => ({
          id: el.experienceLevelId,
          level: el.level
        }));

        // Map technologies to the desired structure, including IDs
        return responses.technologies.map(tech => ({
          technologyId: tech.technologyId,
          technology: tech.name,
          experienceLevels: experienceLevels
        }));
      })
    );
  }

  // Fetch roles from the role API
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRoleUrl);
  }
}
