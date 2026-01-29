import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification, NotificationListResponse } from '../models/notification.model';
import { WebSocketService } from '../../../core/services/websocket.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly API_URL = `${environment.apiUrl}/api/notifications`;
    private unreadCountSignal = signal<number>(0);

    readonly unreadCount = this.unreadCountSignal.asReadonly();

    constructor(
        private http: HttpClient,
        private wsService: WebSocketService
    ) {
        this.initializeWebSocket();
    }

    private initializeWebSocket(): void {
        // Listen for new notifications via WebSocket
        this.wsService.getMessagesByType('notification').subscribe(message => {
            this.unreadCountSignal.update(count => count + 1);
            // You can emit events or show toasts here
        });
    }

    getNotifications(): Observable<NotificationListResponse> {
        return this.http.get<NotificationListResponse>(this.API_URL).pipe(
            tap(response => this.unreadCountSignal.set(response.unreadCount))
        );
    }

    markAsRead(id: string): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}/read`, {}).pipe(
            tap(() => this.unreadCountSignal.update(count => Math.max(0, count - 1)))
        );
    }

    markAllAsRead(): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/read-all`, {}).pipe(
            tap(() => this.unreadCountSignal.set(0))
        );
    }

    deleteNotification(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/unread-count`).pipe(
            tap(count => this.unreadCountSignal.set(count))
        );
    }
}
