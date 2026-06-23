import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse, Role } from '../models/models';
import { API } from './api.base';

const TOKEN_KEY = 'gc_token';
const ROLE_KEY = 'gc_role';
const NAME_KEY = 'gc_name';
const ID_KEY = 'gc_id';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _role = signal<Role | null>(localStorage.getItem(ROLE_KEY) as Role | null);
  private _name = signal<string | null>(localStorage.getItem(NAME_KEY));
  private _id = signal<number | null>(Number(localStorage.getItem(ID_KEY)) || null);

  token() { return this._token(); }
  role() { return this._role(); }
  displayName() { return this._name(); }
  userId() { return this._id(); }

  isLoggedIn() { return !!this._token(); }
  isAdmin() { return this._role() === 'ADMIN'; }
  isUser() { return this._role() === 'USER'; }

  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API}/auth/login`, { usernameOrEmail, password })
      .pipe(tap(r => this.storeLogin(r)));
  }

  register(payload: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API}/auth/register`, payload)
      .pipe(tap(r => this.storeLogin(r)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(ID_KEY);
    this._token.set(null);
    this._role.set(null);
    this._name.set(null);
    this._id.set(null);
    this.router.navigate(['/']);
  }

  private storeLogin(r: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, r.token);
    localStorage.setItem(ROLE_KEY, r.role);
    localStorage.setItem(NAME_KEY, r.displayName);
    localStorage.setItem(ID_KEY, String(r.id));
    this._token.set(r.token);
    this._role.set(r.role);
    this._name.set(r.displayName);
    this._id.set(r.id);
  }
}
