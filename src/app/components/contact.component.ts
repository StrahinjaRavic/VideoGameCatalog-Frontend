import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../services/catalog.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-narrow mx-auto">
      <h3>Contact Us</h3>
      <p class="text-muted">Store address: Knez Mihailova 42, 11000 Beograd · Phone: +381 11 123 4567 · Email: store&#64;gamecatalog.test</p>
      <form (ngSubmit)="submit()" #f="ngForm">
        <div class="mb-2">
          <label class="form-label">Your name</label>
          <input class="form-control" name="name" [(ngModel)]="m.name" required maxlength="100">
        </div>
        <div class="mb-2">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" [(ngModel)]="m.email" required email>
        </div>
        <div class="mb-2">
          <label class="form-label">Message</label>
          <textarea class="form-control" name="message" rows="5" [(ngModel)]="m.message" required maxlength="5000"></textarea>
        </div>
        <button class="btn btn-primary" [disabled]="f.invalid || loading">Send</button>
      </form>
      <div *ngIf="sent" class="alert alert-success mt-3">Your message has been sent.</div>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  `
})
export class ContactComponent {
  private catalog = inject(CatalogService);
  m = { name: '', email: '', message: '' };
  sent = false;
  loading = false;
  error = '';

  submit() {
    this.loading = true; this.error = ''; this.sent = false;
    this.catalog.submitContact(this.m).subscribe({
      next: () => { this.loading = false; this.sent = true; this.m = { name: '', email: '', message: '' }; },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Send failed'; }
    });
  }
}
