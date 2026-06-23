import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../services/catalog.service';
import { GameDetail, PublicReview } from '../models/models';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="game">
      <div class="row">
        <div class="col-md-4">
          <img *ngIf="game.hasImage" [src]="imageUrl()" class="img-fluid rounded mb-3" alt="{{ game.title }}">
          <div *ngIf="!game.hasImage" class="bg-light rounded border d-flex align-items-center justify-content-center" style="height: 240px;">No image</div>
        </div>
        <div class="col-md-8">
          <h2>{{ game.title }}</h2>
          <p class="text-muted mb-1">{{ game.publisher }} · {{ game.releaseYear }}</p>
          <p>
            <span class="badge bg-secondary me-1">{{ game.categoryName }}</span>
            <span class="badge bg-info text-dark me-1">ESRB: {{ game.esrbRating }}</span>
            <span *ngFor="let p of game.platforms" class="badge bg-dark me-1">{{ p.name }}</span>
          </p>
          <p class="lead">{{ game.description }}</p>

          <div *ngIf="game.esrbFacts.length" class="mb-3">
            <h6>ESRB rating reasons</h6>
            <ul class="mb-0"><li *ngFor="let f of game.esrbFacts">{{ f }}</li></ul>
          </div>

          <div class="d-flex align-items-center gap-3">
            <div class="fs-4">
              <span class="star-rating">★</span>
              {{ game.averageRating ? (game.averageRating | number:'1.1-1') : '—' }}
              <small class="text-muted">/ 5</small>
            </div>
            <div *ngIf="game.forSale" class="fs-5"><strong>{{ game.price | currency:'USD' }}</strong></div>
            <div *ngIf="!game.forSale" class="text-muted">Not for sale</div>
          </div>
        </div>
      </div>

      <hr>

      <h4>Reviews</h4>

      <div *ngIf="visibleReviews().length === 0" class="text-muted">No reviews yet.</div>

      <div class="card mb-2" *ngFor="let r of visibleReviews()">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div>
              <strong>{{ r.userFullName }}</strong>
              <span class="text-muted small"> · {{ r.userCity }}</span>
            </div>
            <div class="star-rating">
              <ng-container *ngFor="let _ of counter(r.rating)">★</ng-container>
              <ng-container *ngFor="let _ of counter(5 - r.rating)"><span class="text-muted">★</span></ng-container>
            </div>
          </div>
          <div *ngIf="r.status === 'APPROVED'" class="mt-2">{{ r.comment }}</div>
          <div *ngIf="r.status === 'REJECTED'" class="rejection-box mt-2">
            <em>Comment rejected: {{ r.rejectionReason }}</em>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!game && !error" class="text-muted">Loading...</div>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  `
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);

  game?: GameDetail;
  reviews: PublicReview[] = [];
  error = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalog.getGame(id).subscribe({
      next: g => this.game = g,
      error: err => this.error = err?.error?.message || 'Failed to load game'
    });
    this.catalog.listReviewsForGame(id).subscribe(rs => this.reviews = rs);
  }

  visibleReviews(): PublicReview[] {
    return this.reviews.filter(r => r.status !== 'PENDING');
  }

  imageUrl() { return this.game ? this.catalog.imageUrl(this.game.id) : ''; }

  counter(n: number) { return Array(Math.max(0, n)).fill(0); }
}
