import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <ul class="nav nav-pills mb-4">
      <li class="nav-item"><a routerLink="/admin/games" routerLinkActive="active" class="nav-link">Games</a></li>
      <li class="nav-item"><a routerLink="/admin/categories" routerLinkActive="active" class="nav-link">Categories</a></li>
      <li class="nav-item"><a routerLink="/admin/platforms" routerLinkActive="active" class="nav-link">Platforms</a></li>
      <li class="nav-item"><a routerLink="/admin/reviews" routerLinkActive="active" class="nav-link">Reviews</a></li>
    </ul>
  `
})
export class AdminNavComponent {}
