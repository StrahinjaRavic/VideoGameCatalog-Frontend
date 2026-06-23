import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  year = new Date().getFullYear();
}
