import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="order-list-container">
      <h1>My Orders</h1>
      <p>Component placeholder - implement order history here</p>
    </div>
  `,
    styles: [`
    .order-list-container {
      padding: 2rem;
    }
  `]
})
export class OrderListComponent {
    // TODO: Implement order history with filtering by status
}
