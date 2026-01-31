import { TaskPriority } from './../../../core/models/tasks.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, Signal, Input, signal, computed, DestroyRef } from '@angular/core';
import { TaskColumnComponent } from '../../../components/task-column/task-column.component';
import { TasksService } from '../../../core/services/tasks.service';
import { TaskFilterPipe } from './task-filter.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TaskDialogService } from '../../../core/services/task-dialog.service';
import { TasksUtils } from '../../../core/helpers/tasks.util';
@Component({
  selector: 'app-tasks-analytics',
  standalone: true,
  imports: [CommonModule, TaskColumnComponent, TaskFilterPipe],
  templateUrl: './tasks-analytics.component.html',
  styleUrl: './tasks-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksAnalyticsComponent {
  ref: DynamicDialogRef | undefined;
  taskDialogService = inject(TaskDialogService);
  private tasksService = inject(TasksService);
  readonly statusOptions = TasksUtils.statuses;
  readonly priorityOptions = TasksUtils.priorities;
  statusFilter = signal(this.statusOptions[0].value);
  priorityFilter = signal(this.priorityOptions[0].value);
  compRef = inject(DestroyRef);
  statuses = computed(() => {
    const status = this.statusFilter();
    return status === 'all' ? this.statusOptions.filter(x => x.value !== 'all') : [this.statusOptions.find(x => x.value === status)!];
  });
  constructor() {
    this.tasksService.getTasks();
  }
  tasks = computed(() => {
    return this.tasksService.tasks()?.tasks || [];
  })
  addTask(): void {
    this.ref = this.taskDialogService.open(undefined)
  }
}
