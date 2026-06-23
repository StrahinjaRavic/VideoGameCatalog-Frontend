import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../services/catalog.service';
import { Category, GameSummary } from '../models/models';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <h2 class="mb-4">Game Catalog</h2>

    <div class="row g-2 mb-3">
      <div class="col-md-4">
        <input class="form-control" placeholder="Search by title or publisher..." [(ngModel)]="search">
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="categoryFilter">
          <option [ngValue]="null">All categories</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="forSaleFilter">
          <option [ngValue]="null">All games</option>
          <option [ngValue]="true">For sale</option>
          <option [ngValue]="false">Not for sale</option>
        </select>
      </div>
    </div>

    <div *ngIf="loading" class="text-muted">Loading...</div>

    <div class="row g-3" *ngIf="!loading">
      <div class="col-sm-6 col-md-4 col-lg-3" *ngFor="let g of filtered()">
        <div class="card game-card h-100">
          <img *ngIf="g.hasImage" [src]="imageUrl(g.id)" alt="{{ g.title }}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ g.title }}</h5>
            <div class="text-muted small">{{ g.publisher }} · {{ g.releaseYear }}</div>
            <div class="mt-2">
              <span class="badge bg-secondary me-1">{{ g.categoryName }}</span>
              <span class="badge bg-info text-dark">ESRB: {{ g.esrbRating }}</span>
            </div>
            <div class="mt-2">
              <span class="star-rating">★</span>
              <span class="ms-1">{{ g.averageRating ? (g.averageRating | number:'1.1-1') : 'No ratings' }}</span>
            </div>
            <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
              <strong *ngIf="g.forSale">{{ g.price | currency:'USD' }}</strong>
              <span *ngIf="!g.forSale" class="text-muted small">Not for sale</span>
              <a [routerLink]="['/games', g.id]" class="btn btn-sm btn-primary">Details</a>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="filtered().length === 0" class="text-muted">No games match your filters.</div>
    </div>
  `
})
export class GameListComponent implements OnInit {
  private catalog = inject(CatalogService);
  games: GameSummary[] = [];
  categories: Category[] = [];
  loading = true;
  search = '';
  categoryFilter: number | null = null;
  forSaleFilter: boolean | null = null;

  ngOnInit() {
    this.catalog.listGames().subscribe(g => { this.games = g; this.loading = false; });
    this.catalog.listCategories().subscribe(c => this.categories = c);
  }

  imageUrl(id: number) { return this.catalog.imageUrl(id); }

  filtered(): GameSummary[] {
    const q = this.search.trim().toLowerCase();
    return this.games.filter(g => {
      if (q && !(g.title.toLowerCase().includes(q) || g.publisher.toLowerCase().includes(q))) return false;
      if (this.categoryFilter != null && g.categoryId !== this.categoryFilter) return false;
      if (this.forSaleFilter != null && g.forSale !== this.forSaleFilter) return false;
      return true;
    });
  }
}
