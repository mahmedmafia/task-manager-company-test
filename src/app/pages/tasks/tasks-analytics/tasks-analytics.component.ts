import { TaskPriority } from './../../../core/models/tasks.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, Signal, Input, signal, computed, DestroyRef } from '@angular/core';
import { TaskColumnComponent } from '../../../components/task-column/task-column.component';
import { TasksService } from '../../../core/services/tasks.service';
import { TaskFilterPipe } from './task-filter.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TaskDialogService } from '../../../core/services/task-dialog.service';
import { TasksUtils } from '../../../core/helpers/tasks.util';
import { ButtonDirective } from "primeng/button";
import { UsersService } from '../../../core/services/users.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-tasks-analytics',
  standalone: true,
  imports: [CommonModule, TaskColumnComponent, TaskFilterPipe, ButtonDirective, FormsModule, DropdownModule],
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
  users = computed(() => this.userService.users());
  userFilter = signal<string | null>(null)
  userService = inject(UsersService);
  taskSearch = computed(() => this.tasksService.taskSearch());
  statuses = computed(() => {
    const status = this.statusFilter();
    return status === 'all' ? this.statusOptions.filter(x => x.value !== 'all') : [this.statusOptions.find(x => x.value === status)!];
  });
  constructor() {
    this.tasksService.getTasks();
    this.userService.getUsers();
  }
  tasks = computed(() => this.tasksService.tasks()?.tasks || []);
  filteredTasks = computed(() => {
    const tasks = this.tasks();
    if (!tasks.length) return [];

    const priority = this.priorityFilter();
    const userId = this.userFilter();
    const search = this.taskSearch()?.toLowerCase();
    return tasks.filter(task => {
      const priorityMatch = priority === 'all' || task.priority === priority;
      const userMatch = !userId || task.assignee?.id === userId;
      const textMatch =
        !search ||
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search);
      return  priorityMatch && userMatch && textMatch;
    });

  })
  addTask(): void {
    this.ref = this.taskDialogService.open(undefined)
  }
}
