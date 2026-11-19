import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RecipeService } from '../../../recipes/services/recipe.service';

@Component({
    selector: 'app-chef-dashboard',
    imports: [RouterLink],
    template: `
        <h1>Chef dashboard</h1>
        @if (recipeCount() !== null) { <p>Published recipes: {{ recipeCount() }}</p> }
        @if (error()) { <p role="alert">{{ error() }}</p> }
        <p><a routerLink="/my-recipes">View my recipes</a></p>
        <p><a routerLink="/my-recipes/create">Create recipe</a></p>
    `
})
export class ChefDashboardComponent {
    readonly recipeCount = signal<number | null>(null);
    readonly error = signal('');

    constructor() {
        const chefId = inject(AuthService).currentUser()?.id;
        inject(RecipeService).getAllRecipes().subscribe({
            next: recipes => this.recipeCount.set(recipes.filter(recipe => recipe.chefId === chefId).length),
            error: error => this.error.set(error.message)
        });
    }
}
