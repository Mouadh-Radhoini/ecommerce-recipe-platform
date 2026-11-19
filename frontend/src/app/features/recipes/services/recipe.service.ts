import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CreateRecipeRequest, Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/api/recipes`;

    getAllRecipes() {
        return this.http.get<Recipe[]>(this.url);
    }

    getRecipeById(id: string | number) {
        return this.http.get<Recipe>(`${this.url}/${encodeURIComponent(id)}`);
    }

    createRecipe(recipe: CreateRecipeRequest) {
        return this.http.post<Recipe>(this.url, recipe);
    }
}
