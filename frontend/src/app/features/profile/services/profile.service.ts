import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

export interface UpdateProfileRequest {
    username?: string;
    bio?: string;
    avatarUrl?: string;
}

export interface ChefStats {
    totalRecipes: number;
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    totalFollowers: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly API_URL = `${environment.apiUrl}/api/profile`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getProfile(userId?: string): Observable<User> {
        const url = userId ? `${this.API_URL}/${userId}` : `${this.API_URL}/me`;
        return this.http.get<User>(url);
    }

    updateProfile(data: UpdateProfileRequest): Observable<User> {
        return this.http.put<User>(`${this.API_URL}/me`, data).pipe(
            tap(user => this.authService.updateUser(user))
        );
    }

    uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.http.post<{ avatarUrl: string }>(`${this.API_URL}/avatar`, formData);
    }

    getChefStats(chefId?: string): Observable<ChefStats> {
        const url = chefId
            ? `${this.API_URL}/${chefId}/stats`
            : `${this.API_URL}/me/stats`;
        return this.http.get<ChefStats>(url);
    }
}
