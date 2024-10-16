import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// The API Interceptor
export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);  // Inject AuthService to get token
  const authToken = authService.getToken(); // Get token from AuthService

  const snackBar = inject(MatSnackBar);
  // Clone the request to add the Authorization header if token exists
  const authReq = authToken
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${authToken}`) })
    : req;
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const handledError = handleError(error, snackBar);
      return throwError(() => handledError);
    })
  );
};

// The error handling function
function handleError(error: HttpErrorResponse, snackBar: MatSnackBar): any {
  let errorMessage: any;

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = { message: "Client-side error", details: error.error.message };
  } else {
    // Server-side error
    try {
      // If the error is JSON, parse it
      errorMessage = JSON.parse(error.error);
    } catch (e) {
      // If JSON parsing fails, try custom handling logic
      errorMessage = convertToValidJson(error.error);
    }
  }

  // Handle successful response even if there's an error
  if (error.ok) {
    errorMessage = { message: "Details Fetched", details: error.error };
  }

  // Additional logic for handling HTTP status codes
  if (error.status === 401) {
    errorMessage = { message: "Unauthorized access - Please login", details: error.error };
  } else if (error.status === 404) {
    errorMessage = { message: "Resource not found", details: error.error };
  } else if (error.status === 500) {
    errorMessage = { message: "Internal server error", details: error.error };
  }

  // Show snackbar message on error
  snackBar.open(errorMessage.message, 'Close', {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'right'
  });

  console.error('Error occurred:', errorMessage);
  return errorMessage;
}

// The JSON conversion function
function convertToValidJson(response: any): any {
  const responseString = response.toString();

  return {
    message: "Internal Server Error",
    details: responseString.includes("System.Exception") ? responseString : "Unknown error occurred"
  };
}
