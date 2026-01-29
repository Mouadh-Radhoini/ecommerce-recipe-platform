import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 401:
                        // Unauthorized - logout and redirect to login
                        errorMessage = 'Session expired. Please log in again.';
                        authService.logout();
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to access this resource.';
                        router.navigate(['/unauthorized']);
                        break;
                    case 404:
                        errorMessage = 'Resource not found.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error: ${error.status}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);

            // You can integrate with a toast/notification service here
            // Example: inject(ToastService).error(errorMessage);

            return throwError(() => new Error(errorMessage));
        })
    );
};
