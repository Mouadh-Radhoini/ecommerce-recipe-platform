import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <header class="header">
      <div class="container">
        <div class="logo">
          <a routerLink="/">Recipe Marketplace</a>
        </div>

        <nav class="nav">
          @if (authService.isAuthenticated()) {
            <a routerLink="/recipes">Recipes</a>
            @if (authService.userRole() === 'CHEF') {
              <a routerLink="/my-recipes">My Recipes</a>
              <a routerLink="/dashboard">Dashboard</a>
            }
            @if (authService.userRole() === 'BUYER') {
              <a routerLink="/orders">My Orders</a>
            }
            <a routerLink="/profile">Profile</a>
            <button (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/auth/login">Login</a>
            <a routerLink="/auth/register">Register</a>
          }
        </nav>
      </div>
    </header>
  `,
    styles: [`
    .header {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #4CAF50;
      text-decoration: none;
    }

    .nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav a:hover {
      color: #4CAF50;
    }

    .nav button {
      padding: 0.5rem 1rem;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .nav button:hover {
      background: #da190b;
    }
  `]
})
export class HeaderComponent {
    constructor(public authService: AuthService) { }

    logout(): void {
        this.authService.logout();
    }
}
