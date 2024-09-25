import { Injectable } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Stack } from '../Models/stack';

@Injectable({
  providedIn: 'root',
})
export class StackService {

  private stacks: Stack[] = [
    { "stackName": "Angular", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": ".NET", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": "React", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": "Python", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": "Frontend", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": "Backend", "experienceLevels": ["Fresher", "Mid", "Senior"] },
    { "stackName": "Fullstack", "experienceLevels": ["Fresher", "Mid", "Senior"] }
  ];

  constructor() {}

  // Fetch the stacks from the predefined data
  getStacks(): Observable<Stack[]> {
    return of(this.stacks).pipe(
      catchError((error) => {
        console.error('Error fetching stack options', error);
        return throwError(() => new Error('Error fetching stack options.'));
      })
    );
  }
}
