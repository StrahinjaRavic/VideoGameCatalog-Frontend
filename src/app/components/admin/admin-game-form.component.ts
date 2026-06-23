import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../services/catalog.service';
import { Category, GameRequest, Platform } from '../../models/models';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-game-form',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <h3>{{ id ? 'Edit game' : 'New game' }}</h3>

    <form (ngSubmit)="save()" #f="ngForm" *ngIf="ready">
      <div class="row g-2">
        <div class="col-md-8">
          <label class="form-label">Title</label>
          <input class="form-control" name="title" [(ngModel)]="m.title" required maxlength="200">
        </div>
        <div class="col-md-4">
          <label class="form-label">Release year</label>
          <input type="number" class="form-control" name="year" [(ngModel)]="m.releaseYear" required min="1970" max="2100">
        </div>
      </div>
      <div class="mt-2">
        <label class="form-label">Publisher</label>
        <input class="form-control" name="publisher" [(ngModel)]="m.publisher" required maxlength="150">
      </div>
      <div class="mt-2">
        <label class="form-label">Description</label>
        <textarea class="form-control" name="description" [(ngModel)]="m.description" rows="3" maxlength="10000"></textarea>
      </div>
      <div class="row g-2 mt-1">
        <div class="col-md-3">
          <label class="form-label">ESRB</label>
          <input class="form-control" name="esrb" [(ngModel)]="m.esrbRating" required maxlength="20" placeholder="E, E10+, T, M, AO">
        </div>
        <div class="col-md-4">
          <label class="form-label">Category</label>
          <select class="form-select" name="cat" [(ngModel)]="m.categoryId" required>
            <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">For sale</label>
          <select class="form-select" name="forsale" [(ngModel)]="m.forSale">
            <option [ngValue]="true">Yes</option>
            <option [ngValue]="false">No</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Price</label>
          <input type="number" step="0.01" class="form-control" name="price" [(ngModel)]="m.price" [disabled]="!m.forSale">
        </div>
      </div>

      <div class="mt-3">
        <label class="form-label">Platforms</label>
        <div class="d-flex flex-wrap gap-2">
          <div class="form-check me-2" *ngFor="let p of platforms">
            <input class="form-check-input" type="checkbox" [id]="'p'+p.id"
                   [checked]="m.platformIds.includes(p.id)" (change)="togglePlatform(p.id)">
            <label class="form-check-label" [attr.for]="'p'+p.id">{{ p.name }}</label>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <label class="form-label">ESRB facts (rating reasons)</label>
        <div class="input-group mb-1" *ngFor="let f of m.esrbFacts; let i = index">
          <input class="form-control" [value]="f" (input)="updateFact(i, $any($event.target).value)" maxlength="500">
          <button type="button" class="btn btn-outline-danger" (click)="removeFact(i)">✕</button>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary" (click)="addFact()">+ Add fact</button>
      </div>

      <div class="mt-3" *ngIf="id">
        <label class="form-label">Image (upload replaces current)</label>
        <input type="file" class="form-control" accept="image/*" (change)="onFile($event)">
        <div *ngIf="imagePreviewUrl" class="mt-2">
          <img [src]="imagePreviewUrl" style="max-height:200px">
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-primary" [disabled]="f.invalid || saving">Save</button>
        <button type="button" class="btn btn-link" (click)="cancel()">Cancel</button>
      </div>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  `
})
export class AdminGameFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalog = inject(CatalogService);

  id?: number;
  categories: Category[] = [];
  platforms: Platform[] = [];
  m: GameRequest = {
    title: '', publisher: '', releaseYear: new Date().getFullYear(),
    description: '', esrbRating: 'E', forSale: false, price: null,
    categoryId: 0, platformIds: [], esrbFacts: []
  };
  ready = false;
  saving = false;
  error = '';
  file?: File;
  imagePreviewUrl?: string;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : undefined;

    forkJoin({
      cats: this.catalog.listCategories(),
      plats: this.catalog.listPlatforms()
    }).subscribe(({ cats, plats }) => {
      this.categories = cats;
      this.platforms = plats;
      if (this.id) {
        this.catalog.getGame(this.id).subscribe(g => {
          this.m = {
            title: g.title, publisher: g.publisher, releaseYear: g.releaseYear,
            description: g.description ?? '', esrbRating: g.esrbRating,
            forSale: g.forSale, price: g.price, categoryId: g.categoryId,
            platformIds: g.platforms.map(p => p.id),
            esrbFacts: [...g.esrbFacts]
          };
          if (g.hasImage) this.imagePreviewUrl = this.catalog.imageUrl(g.id);
          this.ready = true;
        });
      } else {
        this.m.categoryId = cats[0]?.id ?? 0;
        this.ready = true;
      }
    });
  }

  togglePlatform(id: number) {
    const i = this.m.platformIds.indexOf(id);
    if (i >= 0) this.m.platformIds.splice(i, 1);
    else this.m.platformIds.push(id);
  }

  addFact() { this.m.esrbFacts.push(''); }
  removeFact(i: number) { this.m.esrbFacts.splice(i, 1); }
  updateFact(i: number, v: string) { this.m.esrbFacts[i] = v; }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.file = input.files?.[0];
  }

  save() {
    this.saving = true; this.error = '';
    const payload: GameRequest = {
      ...this.m,
      esrbFacts: this.m.esrbFacts.filter(t => t.trim().length > 0),
      price: this.m.forSale ? this.m.price : null
    };
    const obs = this.id
      ? this.catalog.updateGame(this.id, payload)
      : this.catalog.createGame(payload);
    obs.subscribe({
      next: saved => {
        if (this.file) {
          this.catalog.uploadImage(saved.id, this.file).subscribe({
            next: () => { this.saving = false; this.router.navigate(['/admin/games']); },
            error: err => { this.saving = false; this.error = err?.error?.message || 'Image upload failed'; }
          });
        } else {
          this.saving = false;
          this.router.navigate(['/admin/games']);
        }
      },
      error: err => { this.saving = false; this.error = err?.error?.message || 'Save failed'; }
    });
  }

  cancel() { this.router.navigate(['/admin/games']); }
}
