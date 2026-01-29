import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ConnectionState {
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    ERROR = 'ERROR'
}

export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: WebSocket | null = null;
    private messageSubject = new Subject<WebSocketMessage>();
    private connectionStateSignal = signal<ConnectionState>(ConnectionState.DISCONNECTED);

    readonly connectionState = this.connectionStateSignal.asReadonly();
    readonly messages$: Observable<WebSocketMessage> = this.messageSubject.asObservable();

    constructor() { }

    connect(url: string, token?: string): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            console.warn('WebSocket already connected');
            return;
        }

        this.connectionStateSignal.set(ConnectionState.CONNECTING);

        // Add token to URL if provided
        const wsUrl = token ? `${url}?token=${token}` : url;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            this.connectionStateSignal.set(ConnectionState.CONNECTED);
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const message: WebSocketMessage = {
                    type: data.type || 'unknown',
                    payload: data.payload || data,
                    timestamp: new Date()
                };
                this.messageSubject.next(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.socket.onerror = (error) => {
            this.connectionStateSignal.set(ConnectionState.ERROR);
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
            this.connectionStateSignal.set(ConnectionState.DISCONNECTED);
            console.log('WebSocket disconnected');
        };
    }

    send(type: string, payload: any): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            this.socket.send(message);
        } else {
            console.error('WebSocket is not connected');
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    // Filter messages by type
    getMessagesByType(type: string): Observable<WebSocketMessage> {
        return new Observable(observer => {
            const subscription = this.messages$.subscribe(message => {
                if (message.type === type) {
                    observer.next(message);
                }
            });
            return () => subscription.unsubscribe();
        });
    }
}
