import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Call the error handling function
      const handledError = handleError(error);
      return throwError(() => handledError); // Rethrow based on the use case
    })
  );
};

// The error handling function
function handleError(error: HttpErrorResponse): any {
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
if(error.ok){
  errorMessage={message:"Details Fetched",details:error.error};
}
  // Additional logic for handling HTTP status codes
  if (error.status === 401) {
    // Handle Unauthorized (401) error, for example, redirect to login
    errorMessage = { message: "Unauthorized access - Please login", details: error.error };
  } else if (error.status === 404) {
    // Handle Not Found (404) error
    errorMessage = { message: "Resource not found", details: error.error };
  } else if (error.status === 500) {
    // Handle Internal Server Error (500)
    errorMessage = { message: "Internal server error", details: error.error };
  }

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
