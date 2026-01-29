import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recipe-form',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="recipe-form-container">
      <h1>Create/Edit Recipe</h1>
      <p>Component placeholder - implement recipe creation/editing form here</p>
    </div>
  `,
    styles: [`
    .recipe-form-container {
      padding: 2rem;
    }
  `]
})
export class RecipeFormComponent {
    // TODO: Implement recipe form with ingredients, steps, and image upload
}
