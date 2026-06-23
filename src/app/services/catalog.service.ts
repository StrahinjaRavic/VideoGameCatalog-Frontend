import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api.base';
import { AdminReview, Category, GameDetail, GameRequest, GameSummary, Platform, PublicReview, ReviewStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  // Games
  listGames(): Observable<GameSummary[]> { return this.http.get<GameSummary[]>(`${API}/games`); }
  getGame(id: number): Observable<GameDetail> { return this.http.get<GameDetail>(`${API}/games/${id}`); }
  imageUrl(id: number) { return `${API}/games/${id}/image`; }

  createGame(req: GameRequest): Observable<GameDetail> {
    return this.http.post<GameDetail>(`${API}/admin/games`, req);
  }
  updateGame(id: number, req: GameRequest): Observable<GameDetail> {
    return this.http.put<GameDetail>(`${API}/admin/games/${id}`, req);
  }
  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/admin/games/${id}`);
  }
  uploadImage(id: number, file: File): Observable<void> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<void>(`${API}/admin/games/${id}/image`, fd);
  }

  // Categories
  listCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${API}/categories`); }
  createCategory(c: { name: string }): Observable<Category> { return this.http.post<Category>(`${API}/admin/categories`, c); }
  updateCategory(id: number, c: { name: string }): Observable<Category> { return this.http.put<Category>(`${API}/admin/categories/${id}`, c); }
  deleteCategory(id: number): Observable<void> { return this.http.delete<void>(`${API}/admin/categories/${id}`); }

  // Platforms
  listPlatforms(): Observable<Platform[]> { return this.http.get<Platform[]>(`${API}/platforms`); }
  createPlatform(p: { name: string }): Observable<Platform> { return this.http.post<Platform>(`${API}/admin/platforms`, p); }
  updatePlatform(id: number, p: { name: string }): Observable<Platform> { return this.http.put<Platform>(`${API}/admin/platforms/${id}`, p); }
  deletePlatform(id: number): Observable<void> { return this.http.delete<void>(`${API}/admin/platforms/${id}`); }

  // Reviews
  listReviewsForGame(gameId: number): Observable<PublicReview[]> {
    return this.http.get<PublicReview[]>(`${API}/reviews/game/${gameId}`);
  }
  submitReview(gameId: number, rating: number, comment: string): Observable<PublicReview> {
    return this.http.post<PublicReview>(`${API}/reviews/game/${gameId}`, { rating, comment });
  }
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/reviews/${id}`);
  }

  // Admin reviews
  adminListReviews(status?: ReviewStatus): Observable<AdminReview[]> {
    const url = status ? `${API}/admin/reviews?status=${status}` : `${API}/admin/reviews`;
    return this.http.get<AdminReview[]>(url);
  }
  approveReview(id: number): Observable<AdminReview> {
    return this.http.post<AdminReview>(`${API}/admin/reviews/${id}/approve`, {});
  }
  rejectReview(id: number, reason: string): Observable<AdminReview> {
    return this.http.post<AdminReview>(`${API}/admin/reviews/${id}/reject`, { reason });
  }
  editReviewComment(id: number, comment: string): Observable<AdminReview> {
    return this.http.put<AdminReview>(`${API}/admin/reviews/${id}/comment`, { comment });
  }

  // Contact
  submitContact(payload: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post(`${API}/contact`, payload);
  }
}
