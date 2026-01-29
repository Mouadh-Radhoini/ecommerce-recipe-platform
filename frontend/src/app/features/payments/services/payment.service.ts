import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    CreatePaymentIntentRequest,
    PaymentIntentResponse,
    ConfirmPaymentRequest,
    Payment
} from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private readonly API_URL = `${environment.apiUrl}/api/payments`;

    constructor(private http: HttpClient) { }

    createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse> {
        return this.http.post<PaymentIntentResponse>(`${this.API_URL}/create-intent`, request);
    }

    confirmPayment(request: ConfirmPaymentRequest): Observable<Payment> {
        return this.http.post<Payment>(`${this.API_URL}/confirm`, request);
    }

    getPaymentById(id: string): Observable<Payment> {
        return this.http.get<Payment>(`${this.API_URL}/${id}`);
    }

    refundPayment(paymentId: string): Observable<Payment> {
        return this.http.post<Payment>(`${this.API_URL}/${paymentId}/refund`, {});
    }
}
