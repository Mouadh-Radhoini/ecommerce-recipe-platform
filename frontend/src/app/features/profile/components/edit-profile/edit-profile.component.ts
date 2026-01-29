import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="edit-profile-container">
      <h1>Edit Profile</h1>
      <p>Component placeholder - implement profile editing form here</p>
    </div>
  `,
    styles: [`
    .edit-profile-container {
      padding: 2rem;
    }
  `]
})
export class EditProfileComponent {
    // TODO: Implement profile editing with avatar upload
}
