import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/api/orders`;

    createOrder(recipeId: string) {
        return this.http.post<Order>(`${this.url}/${encodeURIComponent(recipeId)}`, {});
    }

    getMyOrders() {
        return this.http.get<Order[]>(`${this.url}/my`);
    }
}
