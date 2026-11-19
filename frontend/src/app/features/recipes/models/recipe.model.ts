export interface Recipe {
    id: string | number;
    title: string;
    description: string;
    premium: boolean;
    fullAccess: boolean;
    price?: number;
    rating?: number;
    imageUrl?: string;
    chefName?: string;
    createdAt?: string;
    chefId?: string;
    ingredients?: string[] | null;
    steps?: string[] | null;
    category?: string;
    cookingTime?: number; // in minutes
    servings?: number;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    reviewCount?: number;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface Ingredient {
    name: string;
    quantity: string;
    unit?: string;
}

export interface RecipeStep {
    stepNumber: number;
    instruction: string;
    imageUrl?: string;
}

export interface CreateRecipeRequest {
    title: string;
    description: string;
    premium: boolean;
    price: number;
    imageUrl?: string;
    ingredients: string[];
    steps: string[];
    category?: string;
    cookingTime?: number;
    servings?: number;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
    id: string;
}

export interface RecipeFilter {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    difficulty?: string;
    searchQuery?: string;
    chefId?: string;
}

export interface RecipeListResponse {
    recipes: Recipe[];
    total: number;
    page: number;
    pageSize: number;
}
