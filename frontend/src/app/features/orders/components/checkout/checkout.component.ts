import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Recipe } from '../../../recipes/models/recipe.model';
import { RecipeService } from '../../../recipes/services/recipe.service';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-checkout',
    imports: [CurrencyPipe, RouterLink],
    template: `
        <h1>Review order</h1>
        @if (recipe(); as item) {
            <p>{{ item.title }} · {{ item.price | currency }}</p>
            <p>Orders created here remain pending. Payment processing is unavailable.</p>
            <button type="button" [disabled]="submitting()" (click)="placeOrder(item)">Create pending order</button>
        } @else if (!error()) {
            <p>Loading recipe…</p>
        }
        @if (error()) { <p role="alert">{{ error() }}</p> }
        <a routerLink="/recipes">Back to recipes</a>
    `
})
export class CheckoutComponent {
    private readonly recipes = inject(RecipeService);
    private readonly orders = inject(OrderService);
    private readonly router = inject(Router);
    readonly recipe = signal<Recipe | null>(null);
    readonly error = signal('');
    readonly submitting = signal(false);

    constructor() {
        const id = inject(ActivatedRoute).snapshot.queryParamMap.get('recipeId');
        if (!id) {
            this.error.set('Choose a premium recipe first.');
            return;
        }
        this.recipes.getRecipeById(id).subscribe({
            next: recipe => {
                if (recipe.premium && !recipe.fullAccess) {
                    this.recipe.set(recipe);
                } else {
                    this.error.set('This recipe does not require an order.');
                }
            },
            error: error => this.error.set(error.message)
        });
    }

    placeOrder(recipe: Recipe): void {
        if (this.submitting()) return;
        this.error.set('');
        this.submitting.set(true);
        this.orders.createOrder(String(recipe.id)).pipe(
            finalize(() => this.submitting.set(false))
        ).subscribe({
            next: () => void this.router.navigate(['/orders']),
            error: error => this.error.set(error.message)
        });
    }
}
