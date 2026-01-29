import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const currentRole = authService.userRole();

        if (!currentRole) {
            return router.createUrlTree(['/auth/login']);
        }

        if (allowedRoles.includes(currentRole)) {
            return true;
        }

        // Redirect to unauthorized page or home
        return router.createUrlTree(['/unauthorized']);
    };
};

// Convenience guards
export const buyerGuard: CanActivateFn = roleGuard([UserRole.BUYER]);
export const chefGuard: CanActivateFn = roleGuard([UserRole.CHEF]);
