import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { Platform } from '../../models/models';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-platforms',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <h3>Platforms</h3>

    <form class="row g-2 mb-3" (ngSubmit)="create()" #f="ngForm">
      <div class="col-md-4">
        <input class="form-control" name="n" [(ngModel)]="newName" placeholder="New platform name" required maxlength="100">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" [disabled]="f.invalid">Add</button>
      </div>
    </form>

    <table class="table table-sm">
      <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let p of items">
          <td>{{ p.id }}</td>
          <td><input class="form-control form-control-sm" [(ngModel)]="p.name"></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-1" (click)="save(p)">Save</button>
            <button class="btn btn-sm btn-outline-danger" (click)="remove(p)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  `
})
export class AdminPlatformsComponent implements OnInit {
  private catalog = inject(CatalogService);
  items: Platform[] = [];
  newName = '';
  error = '';

  ngOnInit() { this.load(); }
  load() { this.catalog.listPlatforms().subscribe(x => this.items = x); }

  create() {
    this.catalog.createPlatform({ name: this.newName }).subscribe({
      next: () => { this.newName = ''; this.error = ''; this.load(); },
      error: err => this.error = err?.error?.message || 'Create failed'
    });
  }

  save(p: Platform) {
    this.catalog.updatePlatform(p.id, { name: p.name }).subscribe({
      next: () => this.error = '',
      error: err => this.error = err?.error?.message || 'Save failed'
    });
  }

  remove(p: Platform) {
    if (!confirm(`Delete platform "${p.name}"?`)) return;
    this.catalog.deletePlatform(p.id).subscribe({
      next: () => this.load(),
      error: err => this.error = err?.error?.message || 'Delete failed'
    });
  }
}
