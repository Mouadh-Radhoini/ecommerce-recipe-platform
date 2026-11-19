import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-order-list',
    imports: [CurrencyPipe, DatePipe, RouterLink],
    template: `
        <h1>My Orders</h1>
        @if (loading()) {
            <p>Loading orders…</p>
        } @else if (error()) {
            <p role="alert">{{ error() }}</p>
        } @else {
            <ul>
                @for (order of orders(); track order.id) {
                    <li>
                        <a [routerLink]="['/recipes', order.recipeId]">View recipe</a>
                        · {{ order.status }} · {{ order.amount | currency }}
                        · {{ order.createdAt | date:'mediumDate' }}
                    </li>
                } @empty {
                    <li>You have no orders yet.</li>
                }
            </ul>
        }
    `
})
export class OrderListComponent {
    readonly orders = signal<Order[]>([]);
    readonly error = signal('');
    readonly loading = signal(true);

    constructor() {
        inject(OrderService).getMyOrders().pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: orders => this.orders.set(orders),
            error: error => this.error.set(error.message)
        });
    }
}
