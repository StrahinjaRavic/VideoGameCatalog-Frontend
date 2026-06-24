import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../services/catalog.service';
import { AuthService } from '../services/auth.service';
import { GameDetail, PublicReview } from '../models/models';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

      <div *ngIf="auth.isUser()" class="card mb-4">
        <div class="card-body">
          <h6 class="card-title">{{ myReview ? 'Update your review' : 'Leave a review' }}</h6>
          <div class="mb-2">
            <label class="form-label">Rating</label>
            <select class="form-select" [(ngModel)]="myRating">
              <option *ngFor="let n of [1,2,3,4,5]" [ngValue]="n">{{ n }}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Comment</label>
            <textarea class="form-control" rows="3" [(ngModel)]="myComment" maxlength="5000"></textarea>
          </div>
          <div *ngIf="myReview?.status === 'REJECTED'" class="rejection-box mb-2">
            <strong>Your previous comment was rejected.</strong> Reason: {{ myReview?.rejectionReason }}
          </div>
          <button class="btn btn-primary" (click)="submitReview()" [disabled]="submitting">Submit</button>
          <button *ngIf="myReview" class="btn btn-outline-danger ms-2" (click)="deleteMyReview()">Delete</button>
          <div *ngIf="message" class="mt-2 small text-muted">{{ message }}</div>
        </div>
      </div>

      <div *ngIf="!auth.isLoggedIn()" class="alert alert-info">
        <a routerLink="/login">Log in</a> or <a routerLink="/register">register</a> to leave a review.
      </div>

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
          <div *ngIf="r.status === 'PENDING'" class="text-muted small mt-2"><em>Comment pending admin approval.</em></div>
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
  auth = inject(AuthService);

  game?: GameDetail;
  reviews: PublicReview[] = [];
  error = '';

  myRating = 5;
  myComment = '';
  submitting = false;
  message = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.catalog.getGame(id).subscribe({
      next: g => this.game = g,
      error: err => this.error = err?.error?.message || 'Failed to load game'
    });
    this.catalog.listReviewsForGame(id).subscribe(rs => {
      this.reviews = rs;
      const mine = this.myReview;
      if (mine) { this.myRating = mine.rating; this.myComment = mine.comment || ''; }
    });
  }

  get myReview(): PublicReview | undefined {
    const uid = this.auth.userId();
    const name = this.auth.displayName();
    if (!uid || !name) return undefined;
    return this.reviews.find(r => r.userFullName === name);
  }

  visibleReviews(): PublicReview[] {
    return this.reviews.filter(r => r.status !== 'PENDING' || r.userFullName === this.auth.displayName());
  }

  imageUrl() { return this.game ? this.catalog.imageUrl(this.game.id) : ''; }

  counter(n: number) { return Array(Math.max(0, n)).fill(0); }

  submitReview() {
    if (!this.game) return;
    this.submitting = true;
    this.catalog.submitReview(this.game.id, this.myRating, this.myComment).subscribe({
      next: () => {
        this.submitting = false;
        this.message = 'Submitted. Comment awaits admin approval; rating applies immediately.';
        this.load(this.game!.id);
      },
      error: err => {
        this.submitting = false;
        this.message = err?.error?.message || 'Submit failed';
      }
    });
  }

  deleteMyReview() {
    const mine = this.myReview;
    if (!mine || !this.game) return;
    this.catalog.deleteReview(mine.id).subscribe(() => {
      this.myComment = ''; this.myRating = 5; this.message = 'Review deleted';
      this.load(this.game!.id);
    });
  }
}
