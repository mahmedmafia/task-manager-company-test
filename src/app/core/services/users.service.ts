import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = '/api/users';

  readonly users = signal<User[]>([]);

  constructor(private http: HttpClient) { }
  private readonly _loaded = signal(false);

  getUsers(forceRefresh = false) {
    if (this._loaded()) return;
     this.http.get<User[]>(this.baseUrl).subscribe({
      next: users => {
        this.users.set(users);
        this._loaded.set(true);
      },
      error: err => console.error('[UsersService] loadUsers failed', err)
    });
  }


}

