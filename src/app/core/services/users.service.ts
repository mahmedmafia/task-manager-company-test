import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';
import { of } from 'rxjs';
import { CACHE_TTL_MS } from '../constants';

const CACHE_KEY_USERS = 'users';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = '/api/users';
  private storage = inject(StorageService);
  readonly users = signal<User[]>([]);
  private readonly _loaded = signal(false);

  constructor(private http: HttpClient) { }

  getUsers(forceRefresh = false) {
    if (this._loaded() && !forceRefresh) return;

    const cached = forceRefresh ? null : this.storage.getCached<User[]>(CACHE_KEY_USERS);
    if (cached?.length !== undefined) {
      this.users.set(cached);
      this._loaded.set(true);
      return;
    }

    this.http.get<User[]>(this.baseUrl).pipe(
      tap(users => {
        this.users.set(users);
        this._loaded.set(true);
        this.storage.setCached(CACHE_KEY_USERS, users, CACHE_TTL_MS);
      }),
    ).subscribe();
  }

  invalidateUsersCache(): void {
    this.storage.remove(CACHE_KEY_USERS);
    this._loaded.set(false);
  }
}

