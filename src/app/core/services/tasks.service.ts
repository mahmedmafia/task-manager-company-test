import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { TasksResponse, Task } from '../models/tasks.model';
import { StorageService } from './storage.service';
import { CACHE_TTL_MS } from '../constants';

const CACHE_KEY_TASKS = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private baseUrl = '/api/tasks';
  private storage = inject(StorageService);
  taskSearch = signal<string | null>(null);
  constructor(private http: HttpClient) { }
  tasks = signal<TasksResponse>({ tasks: [], meta: { totalCount: 0, lastUpdated: new Date().toISOString() } });
  tasksLoaded = signal(false);

  getTasks(forceRefresh = false) {
    if (this.tasksLoaded() && !forceRefresh) return;

    const cached = forceRefresh ? null : this.storage.getCached<TasksResponse>(CACHE_KEY_TASKS);
    if (cached?.tasks?.length !== undefined) {
      this.tasks.set(cached);
      this.tasksLoaded.set(true);
      return;
    }

    this.http.get<Task[]>(this.baseUrl).pipe(
      map(tasks => ({ tasks, meta: { totalCount: tasks.length, lastUpdated: new Date().toISOString() } })),
      tap(res => {
        this.tasks.set(res);
        this.tasksLoaded.set(true);
        this.storage.setCached(CACHE_KEY_TASKS, res, CACHE_TTL_MS);
      }),
    ).subscribe();
  }


  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(tap(res => {
      res.id = res.title;
      this.tasks.update((x) => {
        const next = {
          tasks: [...x.tasks, res],
          meta: { lastUpdated: new Date().toISOString(), totalCount: x.meta.totalCount + 1 },
        };
        this.storage.setCached(CACHE_KEY_TASKS, next, CACHE_TTL_MS);
        return next;
      });
    }));
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(tap(res => {
      this.tasks.update((x) => {
        const idx = x.tasks.findIndex(t => t.id === id);
        const tasks = x.tasks.slice();
        if (idx !== -1) tasks[idx] = res;
        const next = {
          tasks,
          meta: { lastUpdated: new Date().toISOString(), totalCount: x.meta.totalCount },
        };
        this.storage.setCached(CACHE_KEY_TASKS, next, CACHE_TTL_MS);
        return next;
      });
    }));
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(tap(() => {
      this.tasks.update((x) => {
        const idx = x.tasks.findIndex(t => t.id === id);
        const tasks = x.tasks.slice();
        if (idx !== -1) tasks.splice(idx, 1);
        const next = {
          tasks,
          meta: { lastUpdated: new Date().toISOString(), totalCount: Math.max(0, x.meta.totalCount - 1) },
        };
        this.storage.setCached(CACHE_KEY_TASKS, next, CACHE_TTL_MS);
        return next;
      });
    }));
  }

  invalidateTasksCache(): void {
    this.storage.remove(CACHE_KEY_TASKS);
    this.tasksLoaded.set(false);
  }
}
