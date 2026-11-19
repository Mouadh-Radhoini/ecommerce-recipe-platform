import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-user-profile',
    template: `
        <h1>My profile</h1>
        @if (auth.currentUser(); as user) {
            <p>{{ user.name }}</p>
            <p>{{ user.email }}</p>
            <p>{{ user.role }}</p>
        }
    `
})
export class UserProfileComponent {
    readonly auth = inject(AuthService);
}
