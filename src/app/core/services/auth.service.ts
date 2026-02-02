import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { StorageService } from './storage.service';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  private baseUrl = '/api/auth';

  private tokenSignal = signal<string | null>(null);
  readonly isAuthenticated = signal(!!this.getToken());


  getToken(): string | null {
    return this.storage.getCached<string>(AUTH_TOKEN_KEY) ?? this.tokenSignal() ?? null;
  }

  getUser(): AuthUser | null {
    return this.storage.getCached<AuthUser>(AUTH_USER_KEY);
  }


  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const res: LoginResponse = {
      token: `mock-jwt-${Date.now()}`,
      user: { email: credentials.email, name: credentials.email.split('@')[0] },
    };
    this.storage.setCached(AUTH_TOKEN_KEY, res.token);
    this.storage.setCached(AUTH_USER_KEY, res.user);
    this.tokenSignal.set(res.token);
    this.isAuthenticated.set(true);
    return of(res);
  }

  logout(): void {
    this.storage.remove(AUTH_TOKEN_KEY);
    this.storage.remove(AUTH_USER_KEY);
    this.tokenSignal.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
