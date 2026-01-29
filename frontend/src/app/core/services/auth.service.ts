import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSignal = signal<User | null>(null);
    private isAuthenticatedSignal = signal<boolean>(false);

    // Public computed signals
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
    readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

    constructor(
        private storageService: StorageService,
        private router: Router
    ) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const token = this.storageService.getToken();
        const user = this.storageService.getUser<User>();

        if (token && user) {
            this.currentUserSignal.set(user);
            this.isAuthenticatedSignal.set(true);
        }
    }

    setAuthData(authResponse: AuthResponse): void {
        this.storageService.setToken(authResponse.token);
        this.storageService.setUser(authResponse.user);
        this.currentUserSignal.set(authResponse.user);
        this.isAuthenticatedSignal.set(true);
    }

    logout(): void {
        this.storageService.clear();
        this.currentUserSignal.set(null);
        this.isAuthenticatedSignal.set(false);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return this.storageService.getToken();
    }

    updateUser(user: User): void {
        this.storageService.setUser(user);
        this.currentUserSignal.set(user);
    }
}
