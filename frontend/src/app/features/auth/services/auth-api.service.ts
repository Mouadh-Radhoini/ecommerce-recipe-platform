import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly API_URL = `${environment.apiUrl}/api/auth`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap(response => this.authService.setAuthData(response))
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        const rolePath = data.role.toLowerCase(); // 'buyer' or 'chef'
        const payload = {
            name: data.name,
            email: data.email,
            password: data.password
        };
        return this.http.post<AuthResponse>(`${this.API_URL}/register/${rolePath}`, payload).pipe(
            tap(response => this.authService.setAuthData(response))
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
            tap(() => this.authService.logout())
        );
    }
}
