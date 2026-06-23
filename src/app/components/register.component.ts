import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-narrow mx-auto">
      <h3>Register</h3>
      <form (ngSubmit)="submit()" #f="ngForm">
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label">First name</label>
            <input class="form-control" name="firstName" [(ngModel)]="m.firstName" required maxlength="50">
          </div>
          <div class="col-md-6">
            <label class="form-label">Last name</label>
            <input class="form-control" name="lastName" [(ngModel)]="m.lastName" required maxlength="50">
          </div>
        </div>
        <div class="mb-2 mt-2">
          <label class="form-label">Address</label>
          <input class="form-control" name="address" [(ngModel)]="m.address" required maxlength="200">
        </div>
        <div class="mb-2">
          <label class="form-label">City</label>
          <input class="form-control" name="city" [(ngModel)]="m.city" required maxlength="100">
        </div>
        <div class="mb-2">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" [(ngModel)]="m.email" required email>
        </div>
        <div class="mb-2">
          <label class="form-label">Phone</label>
          <input class="form-control" name="phone" [(ngModel)]="m.phone" required pattern="^[+0-9 \\-]{6,30}$">
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" name="password" [(ngModel)]="m.password" required minlength="6">
        </div>
        <button class="btn btn-primary" [disabled]="f.invalid || loading">Register</button>
        <a routerLink="/login" class="btn btn-link">Have an account?</a>
      </form>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  m = { firstName: '', lastName: '', address: '', city: '', email: '', phone: '', password: '' };
  loading = false;
  error = '';

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.m).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']); },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
