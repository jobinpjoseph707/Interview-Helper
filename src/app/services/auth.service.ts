import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Base API URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Login method that sends user credentials to the backend
  login(userAuth: { username: string; password: string }): Observable<any> {
    const payload = {
      userName: userAuth.username,
      userPassword: userAuth.password
    };
    return this.http.post<any>(`${this.apiUrl}/Auth/login`, payload).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId) && response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('username', userAuth.username);
        }
      })
    );
  }

  // Register method for creating a new user
  register(user: { username: string; password: string }): Observable<any> {
    const payload = {
      userName: user.username,
      userPassword: user.password
    };
    return this.http.post<any>(`${this.apiUrl}/Auth/register`, payload);
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  // Method to get the JWT token from localStorage
  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  // Logout method that removes the token and user info from localStorage
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    }
  }
}
