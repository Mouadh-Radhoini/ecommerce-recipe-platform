import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars.component';

@Component({
    selector: 'app-recipe-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent, RatingStarsComponent],
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
    recipes = signal<Recipe[]>([]);
    isLoading = signal(false);

    searchControl = new FormControl<string>('', { nonNullable: true });
    sortControl = new FormControl<string>('latest', { nonNullable: true });

    constructor(
        private recipeService: RecipeService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadRecipes();
    }

    onSearch(): void {
        this.loadRecipes();
    }

    onSortChange(): void {
        this.loadRecipes();
    }

    private buildParams(): { search?: string; sort?: string } {
        const search = this.searchControl.value.trim();
        const sort = this.sortControl.value;

        return {
            search: search.length > 0 ? search : undefined,
            sort: sort || undefined
        };
    }

    private loadRecipes(): void {
        this.isLoading.set(true);

        this.recipeService.getAllRecipes(this.buildParams())
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (recipes) => this.recipes.set(recipes ?? []),
                error: (error) => {
                    this.recipes.set([]);
                    this.toastService.error(error.message || 'Failed to load recipes.');
                }
            });
    }
}
