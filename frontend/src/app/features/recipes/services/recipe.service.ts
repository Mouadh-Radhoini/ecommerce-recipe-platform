import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    Recipe,
    CreateRecipeRequest,
    UpdateRecipeRequest,
    RecipeFilter,
    RecipeListResponse
} from '../models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private readonly API_URL = `${environment.apiUrl}/api/recipes`;

    constructor(private http: HttpClient) { }

    getAllRecipes(params?: { search?: string; sort?: string; page?: number; size?: number }): Observable<Recipe[]> {
        let httpParams = new HttpParams();

        if (params?.search) httpParams = httpParams.set('search', params.search);
        if (params?.sort) httpParams = httpParams.set('sort', params.sort);
        if (params?.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
        if (params?.size !== undefined) httpParams = httpParams.set('size', params.size.toString());

        return this.http.get<Recipe[]>(this.API_URL, { params: httpParams });
    }

    getRecipes(filter?: RecipeFilter, page = 0, pageSize = 12): Observable<RecipeListResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', pageSize.toString());

        if (filter) {
            if (filter.category) params = params.set('category', filter.category);
            if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
            if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
            if (filter.difficulty) params = params.set('difficulty', filter.difficulty);
            if (filter.searchQuery) params = params.set('search', filter.searchQuery);
            if (filter.chefId) params = params.set('chefId', filter.chefId);
        }

        return this.http.get<RecipeListResponse>(this.API_URL, { params });
    }

    getRecipeById(id: string | number): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.API_URL}/${id}`);
    }

    createRecipe(recipe: CreateRecipeRequest): Observable<Recipe> {
        return this.http.post<Recipe>(this.API_URL, recipe);
    }

    updateRecipe(recipe: UpdateRecipeRequest): Observable<Recipe> {
        return this.http.put<Recipe>(`${this.API_URL}/${recipe.id}`, recipe);
    }

    deleteRecipe(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    purchaseRecipe(id: string): Observable<any> {
        return this.http.post(`${this.API_URL}/${id}/purchase`, {});
    }

    searchRecipes(query: string): Observable<Recipe[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<Recipe[]>(`${this.API_URL}/search`, { params });
    }

    getChefRecipes(chefId: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.API_URL}/chef/${chefId}`);
    }
}
