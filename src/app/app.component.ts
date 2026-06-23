import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Game Catalog</a>
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Games</a></li>
          <li class="nav-item" *ngIf="auth.isAdmin()"><a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin</a></li>
        </ul>
        <ul class="navbar-nav">
          <ng-container *ngIf="!auth.isLoggedIn(); else logged">
            <li class="nav-item"><a class="nav-link" routerLink="/login">Login</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/register">Register</a></li>
          </ng-container>
          <ng-template #logged>
            <li class="nav-item"><span class="nav-link text-light">{{ auth.displayName() }}</span></li>
            <li class="nav-item"><button class="btn btn-outline-light btn-sm mt-1" (click)="logout()">Logout</button></li>
          </ng-template>
        </ul>
      </div>
    </nav>
    <main class="container pb-5">
      <router-outlet></router-outlet>
    </main>
    <footer class="text-center text-muted py-3">
      <small>&copy; {{ year }} Video Game Catalog</small>
    </footer>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  year = new Date().getFullYear();

  logout() { this.auth.logout(); }
}
