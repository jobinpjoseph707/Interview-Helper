import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';

// The API Interceptor
export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const authService = inject(AuthService);  // Inject AuthService to get token
  const authToken = authService.getToken(); // Get token from AuthService

  loaderService.show();


  const snackBar = inject(MatSnackBar);

  const token = authService.getToken();
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        handleSuccess(event, snackBar);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const handledError = handleError(error, snackBar);
      return throwError(() => handledError);
    }), finalize(() => {
      // Hide loader after request completes, whether successful or not
      loaderService.hide();
    })
  );
};

// Updated Success handling function
function handleSuccess(response: HttpResponse<any>, snackBar: MatSnackBar): void {
  let responseMessage: string | null = null;

  if (response.body && typeof response.body === 'object') {
    if ('message' in response.body && typeof response.body.message === 'string') {
      responseMessage = response.body.message;
    } else if ('status' in response.body && response.body.status === 'success' && 'message' in response.body) {
      responseMessage = response.body.message;
    }
  }

  // Only show a snackbar if there's a message from the backend
  if (responseMessage) {
    snackBar.open(responseMessage, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  console.log('API Interceptor Success:', responseMessage || 'No message provided', response);
}

// Error handling function (unchanged)
function handleError(error: HttpErrorResponse, snackBar: MatSnackBar): string {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`;
  } else {
    switch (error.status) {
      case 401:
        errorMessage = 'Unauthorized access - Please login';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 500:
        errorMessage = 'Internal server error';
        break;
      default:
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        break;
    }
  }

  snackBar.open(errorMessage, 'Close', {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
  });

  console.error('API Interceptor Error:', errorMessage);
  return errorMessage;
}
