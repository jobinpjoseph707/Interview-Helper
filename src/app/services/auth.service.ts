import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7042/api/Auth'; // Base URL for backend auth APIs

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Login user and store JWT token in localStorage
   */

  login(userAuth: { username: string; password: string }): Observable<any> {
    console.log(userAuth);
    
    return this.http.post(`${this.baseUrl}/login`, {
        userName: userAuth.username,
        userPassword: userAuth.password
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('username', response.user.userName);
        localStorage.setItem('authToken', response.token);
      }),
      catchError(this.handleError)
        );
}


  /**
   * Register new user
   */
  register(user: { username: string; password: string }): Observable<any> {
    const payload = {
      userName: user.username,
      userPassword: user.password
  };
    return this.http.post(`${this.baseUrl}/register`, payload).pipe(
      tap(() => console.log('User registered successfully')),
      catchError(this.handleError)
    );
  }

  /**
   * Check if user is logged in (token exists)
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Logout user by clearing token and navigating to login
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  /**
   * Error handling method
   */
  private handleError(error: any): Observable<never> {
    console.error('AuthService Error:', error);
    return throwError(() => new Error(error.message || 'Authentication failed'));
  }
}
