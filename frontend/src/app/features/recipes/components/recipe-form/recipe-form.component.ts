import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';

@Component({
    selector: 'app-recipe-form',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
        <h1>Create recipe</h1>
        <form [formGroup]="form" (ngSubmit)="save()">
            <p><label>Title <input formControlName="title" required></label></p>
            <p><label>Description <textarea formControlName="description" required></textarea></label></p>
            <p><label>Ingredients (one per line) <textarea formControlName="ingredients" required></textarea></label></p>
            <p><label>Steps (one per line) <textarea formControlName="steps" required></textarea></label></p>
            <p><label><input type="checkbox" formControlName="premium"> Premium recipe</label></p>
            @if (form.controls.premium.value) {
                <p><label>Price <input type="number" step="0.01" min="0.01" formControlName="price" required></label></p>
            }
            @if (error()) { <p role="alert">{{ error() }}</p> }
            <button type="submit" [disabled]="saving()">Create recipe</button>
            <a routerLink="/my-recipes">Cancel</a>
        </form>
    `
})
export class RecipeFormComponent {
    private readonly recipes = inject(RecipeService);
    private readonly router = inject(Router);
    readonly saving = signal(false);
    readonly error = signal('');
    readonly form = inject(FormBuilder).nonNullable.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        ingredients: ['', Validators.required],
        steps: ['', Validators.required],
        premium: false,
        price: 0
    });

    save(): void {
        if (this.saving()) return;
        const values = this.form.getRawValue();
        const title = values.title.trim();
        const description = values.description.trim();
        const ingredients = this.lines(values.ingredients);
        const steps = this.lines(values.steps);
        if (!title || !description || !ingredients.length || !steps.length ||
            (values.premium && (!Number.isFinite(values.price) || values.price <= 0))) {
            this.error.set('Enter a title, description, ingredients and steps, and a positive price for premium recipes.');
            return;
        }

        this.error.set('');
        this.saving.set(true);
        this.recipes.createRecipe({
            title, description, ingredients, steps, premium: values.premium,
            price: values.premium ? values.price : 0
        }).pipe(finalize(() => this.saving.set(false))).subscribe({
            next: recipe => void this.router.navigate(['/recipes', recipe.id]),
            error: error => this.error.set(error.message)
        });
    }

    private lines(value: string): string[] {
        return value.split('\n').map(line => line.trim()).filter(Boolean);
    }
}
