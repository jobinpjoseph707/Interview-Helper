// src/app/services/role.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roles = [
    { name: 'Frontend' },
    { name: 'Backend' },
    { name: 'SQL/Database' }
  ];

  constructor() {}

  // Fetch the roles from the predefined data
  getRoles(): Observable<any[]> {
    return of(this.roles).pipe(
      catchError((error) => {
        console.error('Error fetching role options', error);
        return throwError(() => new Error('Error fetching role options.'));
      })
    );
  }
}
