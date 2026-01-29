import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order, CreateOrderRequest, OrderListResponse } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly API_URL = `${environment.apiUrl}/api/orders`;

    constructor(private http: HttpClient) { }

    createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
        return this.http.post<Order>(this.API_URL, orderRequest);
    }

    getMyOrders(page = 0, pageSize = 10): Observable<OrderListResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', pageSize.toString());
        return this.http.get<OrderListResponse>(`${this.API_URL}/my-orders`, { params });
    }

    getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.API_URL}/${id}`);
    }

    // For chefs to view their sales
    getMySales(page = 0, pageSize = 10): Observable<OrderListResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', pageSize.toString());
        return this.http.get<OrderListResponse>(`${this.API_URL}/my-sales`, { params });
    }

    cancelOrder(id: string): Observable<Order> {
        return this.http.post<Order>(`${this.API_URL}/${id}/cancel`, {});
    }
}
