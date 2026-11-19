import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../../../core/services/auth.service';
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
    private readonly allRecipes = signal<Recipe[]>([]);
    readonly onlyMine = inject(ActivatedRoute).snapshot.data['onlyMine'] === true;
    private readonly auth = inject(AuthService);
    private readonly search = signal('');
    private readonly sort = signal('latest');
    readonly recipes = computed(() => {
        const query = this.search();
        const matches = this.allRecipes().filter(recipe =>
            (!this.onlyMine || recipe.chefId === this.auth.currentUser()?.id) &&
            (recipe.title.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query))
        );
        const price = (recipe: Recipe) => recipe.price ?? 0;
        switch (this.sort()) {
            case 'priceAsc': return matches.sort((a, b) => price(a) - price(b));
            case 'priceDesc': return matches.sort((a, b) => price(b) - price(a));
            default: return matches.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        }
    });
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
        this.search.set(this.searchControl.value.trim().toLowerCase());
    }

    onSortChange(): void {
        this.sort.set(this.sortControl.value);
    }

    private loadRecipes(): void {
        this.isLoading.set(true);

        this.recipeService.getAllRecipes()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (recipes) => this.allRecipes.set(recipes ?? []),
                error: (error) => {
                    this.allRecipes.set([]);
                    this.toastService.error(error.message || 'Failed to load recipes.');
                }
            });
    }
}
