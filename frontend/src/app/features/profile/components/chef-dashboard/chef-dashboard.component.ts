import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chef-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <h1>Chef Dashboard</h1>
      <p>Component placeholder - implement chef analytics and sales stats here</p>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: 2rem;
    }
  `]
})
export class ChefDashboardComponent {
    // TODO: Implement dashboard with sales stats, revenue charts, popular recipes
}
