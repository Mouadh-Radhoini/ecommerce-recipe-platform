export enum UserRole {
    BUYER = 'BUYER',
    CHEF = 'CHEF'
}

export interface BaseUser {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    createdAt: Date;
    updatedAt?: Date;
    avatarUrl?: string;
    bio?: string;
}

export interface Buyer extends BaseUser {
    role: UserRole.BUYER;
    purchasedRecipes?: string[]; // Recipe IDs
    favoriteRecipes?: string[];
    following?: string[]; // Chef IDs
}

export interface Chef extends BaseUser {
    role: UserRole.CHEF;
    recipes?: string[]; // Recipe IDs
    totalSales?: number;
    rating?: number;
    followers?: string[]; // User IDs
}

export type User = Buyer | Chef;

// Type guards
export function isBuyer(user: User): user is Buyer {
    return user.role === UserRole.BUYER;
}

export function isChef(user: User): user is Chef {
    return user.role === UserRole.CHEF;
}

// Authentication DTOs
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
    role: UserRole;
}

export interface AuthResponse {
    token: string;
    user: User;
}
