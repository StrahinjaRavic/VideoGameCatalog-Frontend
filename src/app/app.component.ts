import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container">
        <span class="navbar-brand">Game Catalog</span>
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
