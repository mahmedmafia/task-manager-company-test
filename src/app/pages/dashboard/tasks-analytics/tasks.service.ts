import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TasksResponse } from '../../../core/models/tasks.model';



@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private jsonUrl = 'assets/mocks/tasks.json';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(this.jsonUrl);
  }
}
