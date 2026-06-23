import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { Category } from '../../models/models';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <h3>Categories</h3>

    <form class="row g-2 mb-3" (ngSubmit)="create()" #f="ngForm">
      <div class="col-md-4">
        <input class="form-control" name="n" [(ngModel)]="newName" placeholder="New category name" required maxlength="100">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" [disabled]="f.invalid">Add</button>
      </div>
    </form>

    <table class="table table-sm">
      <thead><tr><th>ID</th><th>Name</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let c of items">
          <td>{{ c.id }}</td>
          <td>
            <input class="form-control form-control-sm" [(ngModel)]="c.name">
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-1" (click)="save(c)">Save</button>
            <button class="btn btn-sm btn-outline-danger" (click)="remove(c)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private catalog = inject(CatalogService);
  items: Category[] = [];
  newName = '';
  error = '';

  ngOnInit() { this.load(); }

  load() { this.catalog.listCategories().subscribe(x => this.items = x); }

  create() {
    this.catalog.createCategory({ name: this.newName }).subscribe({
      next: () => { this.newName = ''; this.error = ''; this.load(); },
      error: err => this.error = err?.error?.message || 'Create failed'
    });
  }

  save(c: Category) {
    this.catalog.updateCategory(c.id, { name: c.name }).subscribe({
      next: () => this.error = '',
      error: err => this.error = err?.error?.message || 'Save failed'
    });
  }

  remove(c: Category) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    this.catalog.deleteCategory(c.id).subscribe({
      next: () => this.load(),
      error: err => this.error = err?.error?.message || 'Delete failed'
    });
  }
}
