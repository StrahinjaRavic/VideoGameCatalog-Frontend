import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/game-list.component').then(m => m.GameListComponent) },
  { path: 'games/:id', loadComponent: () => import('./components/game-detail.component').then(m => m.GameDetailComponent) },
  { path: 'login', loadComponent: () => import('./components/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register.component').then(m => m.RegisterComponent) }
];
