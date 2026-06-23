import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { AdminReview, ReviewStatus } from '../../models/models';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Reviews</h3>
      <select class="form-select w-auto" [(ngModel)]="filter" (change)="load()">
        <option [ngValue]="null">All</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>

    <div class="card mb-2" *ngFor="let r of items">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <strong>{{ r.gameTitle }}</strong>
            <span class="text-muted"> · by {{ r.userFullName }}</span>
          </div>
          <div>
            <span class="badge"
                  [class.bg-secondary]="r.status==='PENDING'"
                  [class.bg-success]="r.status==='APPROVED'"
                  [class.bg-danger]="r.status==='REJECTED'">
              {{ r.status }}
            </span>
            <span class="ms-2 star-rating">★ {{ r.rating }}/5</span>
          </div>
        </div>
        <div class="mt-2">
          <label class="form-label small text-muted">Comment (editable)</label>
          <textarea class="form-control" rows="2" [(ngModel)]="r.comment" maxlength="5000"></textarea>
        </div>
        <div class="mt-2" *ngIf="r.status === 'REJECTED'">
          <strong>Rejection reason:</strong> {{ r.rejectionReason }}
        </div>
        <div class="mt-2 d-flex gap-2 flex-wrap">
          <button class="btn btn-sm btn-outline-primary" (click)="saveComment(r)">Save comment</button>
          <button class="btn btn-sm btn-success" (click)="approve(r)" [disabled]="r.status==='APPROVED'">Approve</button>
          <button class="btn btn-sm btn-danger" (click)="reject(r)" [disabled]="r.status==='REJECTED'">Reject…</button>
        </div>
      </div>
    </div>

    <div *ngIf="items.length === 0" class="text-muted">No reviews.</div>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  `
})
export class AdminReviewsComponent implements OnInit {
  private catalog = inject(CatalogService);
  items: AdminReview[] = [];
  filter: ReviewStatus | null = 'PENDING';
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.catalog.adminListReviews(this.filter ?? undefined).subscribe({
      next: r => this.items = r,
      error: err => this.error = err?.error?.message || 'Load failed'
    });
  }

  saveComment(r: AdminReview) {
    this.catalog.editReviewComment(r.id, r.comment || '').subscribe({
      next: updated => Object.assign(r, updated),
      error: err => this.error = err?.error?.message || 'Save failed'
    });
  }

  approve(r: AdminReview) {
    this.catalog.approveReview(r.id).subscribe({
      next: updated => Object.assign(r, updated),
      error: err => this.error = err?.error?.message || 'Approve failed'
    });
  }

  reject(r: AdminReview) {
    const reason = prompt('Rejection reason:', r.rejectionReason || '');
    if (!reason) return;
    this.catalog.rejectReview(r.id, reason).subscribe({
      next: updated => Object.assign(r, updated),
      error: err => this.error = err?.error?.message || 'Reject failed'
    });
  }
}
