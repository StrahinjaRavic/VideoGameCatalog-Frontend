import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/guards';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/game-list.component').then(m => m.GameListComponent) },
  { path: 'games/:id', loadComponent: () => import('./components/game-detail.component').then(m => m.GameDetailComponent) },
  { path: 'login', loadComponent: () => import('./components/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register.component').then(m => m.RegisterComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact.component').then(m => m.ContactComponent) },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'games', pathMatch: 'full' },
      { path: 'games', loadComponent: () => import('./components/admin/admin-games.component').then(m => m.AdminGamesComponent) },
      { path: 'games/new', loadComponent: () => import('./components/admin/admin-game-form.component').then(m => m.AdminGameFormComponent) },
      { path: 'games/:id/edit', loadComponent: () => import('./components/admin/admin-game-form.component').then(m => m.AdminGameFormComponent) },
      { path: 'categories', loadComponent: () => import('./components/admin/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'platforms', loadComponent: () => import('./components/admin/admin-platforms.component').then(m => m.AdminPlatformsComponent) },
      { path: 'reviews', loadComponent: () => import('./components/admin/admin-reviews.component').then(m => m.AdminReviewsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
