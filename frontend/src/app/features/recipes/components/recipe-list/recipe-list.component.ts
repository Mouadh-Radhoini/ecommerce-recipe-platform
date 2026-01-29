import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recipe-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="recipe-list-container">
      <h1>Recipe List</h1>
      <p>Component placeholder - implement recipe browsing functionality here</p>
    </div>
  `,
    styles: [`
    .recipe-list-container {
      padding: 2rem;
    }
  `]
})
export class RecipeListComponent {
    // TODO: Implement recipe list with filtering, pagination, and search
}
