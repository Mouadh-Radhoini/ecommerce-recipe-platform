import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="profile-container">
      <h1>User Profile</h1>
      <p>Component placeholder - implement user profile view here</p>
    </div>
  `,
    styles: [`
    .profile-container {
      padding: 2rem;
    }
  `]
})
export class UserProfileComponent {
    // TODO: Implement profile view with user info and recipes (for chefs)
}
