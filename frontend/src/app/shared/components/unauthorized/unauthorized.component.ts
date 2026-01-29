import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="unauthorized-container">
      <div class="content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <a routerLink="/" class="home-link">Go to Home</a>
      </div>
    </div>
  `,
    styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      text-align: center;
    }

    .content h1 {
      font-size: 6rem;
      margin: 0;
      color: #f44336;
    }

    .content h2 {
      font-size: 2rem;
      margin: 1rem 0;
      color: #333;
    }

    .content p {
      color: #666;
      margin-bottom: 2rem;
    }

    .home-link {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }

    .home-link:hover {
      background: #45a049;
    }
  `]
})
export class UnauthorizedComponent { }
