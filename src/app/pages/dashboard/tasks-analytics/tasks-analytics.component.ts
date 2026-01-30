import { TaskPriority } from './../../../core/models/tasks.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, Signal, Input, signal, computed } from '@angular/core';
import { TaskColumnComponent } from '../../../components/task-column/task-column.component';
import { TasksService } from './tasks.service';
import { Observable, filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskFilterPipe } from './task-filter.pipe';
import { Task, TaskStatus } from '../../../core/models/tasks.model';

@Component({
  selector: 'app-tasks-analytics',
  standalone: true,
  imports: [CommonModule, TaskColumnComponent, TaskFilterPipe],
  templateUrl: './tasks-analytics.component.html',
  styleUrl: './tasks-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksAnalyticsComponent {
  private tasksService = inject(TasksService);
  readonly statusOptions = STATUS_OPTIONS;
  readonly priorityOptions = PRIORITY_OPTIONS;
  statusFilter = signal<TaskFilterStatus>(this.statusOptions[0].value);
  priorityFilter = signal<TaskFilterPriority>(this.priorityOptions[0].value);
  statuses = computed(() => {
    const status = this.statusFilter();
    return status === 'all' ? this.statusOptions.filter(x => x.value !== 'all') : [this.statusOptions.find(x => x.value === status)!];
  });


  tasks: Signal<Task[]> = toSignal(
    this.tasksService.getTasks().pipe(map(res => res.tasks)),
    { initialValue: [] }
  );
}
type TaskFilterStatus = (TaskStatus | 'all')
const STATUS_OPTIONS: { value: TaskFilterStatus, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
type TaskFilterPriority = (TaskPriority | 'all');
const PRIORITY_OPTIONS: { value: TaskFilterPriority, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;
