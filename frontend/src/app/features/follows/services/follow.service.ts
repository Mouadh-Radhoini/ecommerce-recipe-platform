import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Follow, FollowStats } from '../models/follow.model';

@Injectable({
    providedIn: 'root'
})
export class FollowService {
    private readonly API_URL = `${environment.apiUrl}/api/follows`;

    constructor(private http: HttpClient) { }

    followUser(userId: string): Observable<Follow> {
        return this.http.post<Follow>(`${this.API_URL}/${userId}`, {});
    }

    unfollowUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${userId}`);
    }

    isFollowing(userId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.API_URL}/${userId}/is-following`);
    }

    getFollowers(userId: string): Observable<Follow[]> {
        return this.http.get<Follow[]>(`${this.API_URL}/${userId}/followers`);
    }

    getFollowing(userId: string): Observable<Follow[]> {
        return this.http.get<Follow[]>(`${this.API_URL}/${userId}/following`);
    }

    getFollowStats(userId: string): Observable<FollowStats> {
        return this.http.get<FollowStats>(`${this.API_URL}/${userId}/stats`);
    }
}
