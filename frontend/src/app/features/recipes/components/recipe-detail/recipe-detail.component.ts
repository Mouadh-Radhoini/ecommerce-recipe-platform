import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars.component';

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, LoaderComponent, RatingStarsComponent],
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
    recipe = signal<Recipe | null>(null);
    isLoading = signal(false);
    notFound = signal(false);

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.notFound.set(true);
            return;
        }

        this.fetchRecipe(id);
    }

    private fetchRecipe(id: string): void {
        this.isLoading.set(true);
        this.notFound.set(false);

        this.recipeService.getRecipeById(id)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (recipe) => this.recipe.set(recipe),
                error: (error) => {
                    this.recipe.set(null);
                    this.notFound.set(true);
                    this.toastService.error(error.message || 'Recipe not found.');
                }
            });
    }
}
