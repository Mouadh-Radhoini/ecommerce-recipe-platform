import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { buyerGuard, chefGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/recipes',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: 'recipes',
        children: [
            {
                path: '',
                canActivate: [authGuard],
                loadComponent: () => import('./features/recipes/components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent)
            },
            {
                path: ':id',
                canActivate: [authGuard],
                loadComponent: () => import('./features/recipes/components/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent)
            }
        ]
    },
    {
        path: 'my-recipes',
        canActivate: [authGuard, chefGuard],
        children: [
            {
                path: '',
                data: { onlyMine: true },
                loadComponent: () => import('./features/recipes/components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent)
            },
            {
                path: 'create',
                loadComponent: () => import('./features/recipes/components/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent)
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    },
    {
        path: 'orders',
        canActivate: [authGuard, buyerGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/orders/components/order-list/order-list.component').then(m => m.OrderListComponent)
            },
            {
                path: ':id',
                redirectTo: ''
            }
        ]
    },
    {
        path: 'checkout',
        canActivate: [authGuard, buyerGuard],
        loadComponent: () => import('./features/orders/components/checkout/checkout.component').then(m => m.CheckoutComponent)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/profile/components/user-profile/user-profile.component').then(m => m.UserProfileComponent)
            },
            {
                path: 'edit',
                redirectTo: ''
            }
        ]
    },
    {
        path: 'dashboard',
        canActivate: [authGuard, chefGuard],
        loadComponent: () => import('./features/profile/components/chef-dashboard/chef-dashboard.component').then(m => m.ChefDashboardComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
    {
        path: '**',
        redirectTo: '/recipes'
    }
];
