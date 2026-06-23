import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { GameSummary } from '../../models/models';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-games',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Games</h3>
      <a routerLink="/admin/games/new" class="btn btn-primary">+ New Game</a>
    </div>

    <table class="table">
      <thead>
        <tr><th>Title</th><th>Publisher</th><th>Year</th><th>Category</th><th>ESRB</th><th>Sale</th><th>Price</th><th></th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let g of games">
          <td>{{ g.title }}</td>
          <td>{{ g.publisher }}</td>
          <td>{{ g.releaseYear }}</td>
          <td>{{ g.categoryName }}</td>
          <td>{{ g.esrbRating }}</td>
          <td><span *ngIf="g.forSale" class="badge bg-success">Yes</span><span *ngIf="!g.forSale" class="badge bg-secondary">No</span></td>
          <td>{{ g.forSale ? (g.price | currency:'USD') : '—' }}</td>
          <td class="text-end">
            <a [routerLink]="['/admin/games', g.id, 'edit']" class="btn btn-sm btn-outline-primary me-1">Edit</a>
            <button class="btn btn-sm btn-outline-danger" (click)="remove(g)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  `
})
export class AdminGamesComponent implements OnInit {
  private catalog = inject(CatalogService);
  games: GameSummary[] = [];
  error = '';

  ngOnInit() { this.load(); }
  load() { this.catalog.listGames().subscribe(g => this.games = g); }

  remove(g: GameSummary) {
    if (!confirm(`Delete "${g.title}"?`)) return;
    this.catalog.deleteGame(g.id).subscribe({
      next: () => this.load(),
      error: err => this.error = err?.error?.message || 'Delete failed'
    });
  }
}
