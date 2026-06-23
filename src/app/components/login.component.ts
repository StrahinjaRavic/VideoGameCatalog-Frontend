import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-narrow mx-auto">
      <h3>Login</h3>
      <form (ngSubmit)="submit()" #f="ngForm">
        <div class="mb-3">
          <label class="form-label">Username (admin) or email (user)</label>
          <input class="form-control" name="u" [(ngModel)]="u" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" name="p" [(ngModel)]="p" required>
        </div>
        <button class="btn btn-primary" [disabled]="f.invalid || loading">Log in</button>
        <a routerLink="/register" class="btn btn-link">Create an account</a>
      </form>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      <div class="text-muted small mt-3">
        Demo: admin / admin123 &nbsp;·&nbsp; user&#64;test.com / user123
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  u = '';
  p = '';
  error = '';
  loading = false;

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.u, this.p).subscribe({
      next: r => {
        this.loading = false;
        this.router.navigate([r.role === 'ADMIN' ? '/admin' : '/']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
