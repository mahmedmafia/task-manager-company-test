import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { TasksResponse, Task } from '../models/tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // Use the proxied API endpoint (see proxy.conf.json) so calls to /api/* go to json-server
  private baseUrl = '/api/tasks';

  constructor(private http: HttpClient) { }
  tasks = signal<TasksResponse | null>(null)
  /**
   * Get all tasks from json-server and adapt to TasksResponse shape
   */
  getTasks() {
    this.http.get<Task[]>(this.baseUrl).pipe(
      map(tasks => ({ tasks, meta: { totalCount: tasks.length, lastUpdated: new Date().toISOString() } }))
    ).subscribe(res => {
      this.tasks.set(res);
    });
  }

  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(tap(res=>{
      res.id=res.title;
      this.tasks.update((x)=>{
        return{
          tasks:x? [...x.tasks,res] : [res],
          meta:{
            lastUpdated:new Date().toISOString(),
            totalCount:x ? x.meta.totalCount+1 :1,
          },
        }
      })
    }));
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
