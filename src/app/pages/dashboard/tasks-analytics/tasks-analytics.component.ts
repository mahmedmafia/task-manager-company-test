import { TaskPriority } from './../../../core/models/tasks.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, Signal, Input, signal, computed, DestroyRef } from '@angular/core';
import { TaskColumnComponent } from '../../../components/task-column/task-column.component';
import { TasksService } from '../../../core/services/tasks.service';
import { Observable, filter, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TaskFilterPipe } from './task-filter.pipe';
import { Task, TaskStatus } from '../../../core/models/tasks.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateTaskComponent } from '../../../components/update-task/update-task.component';
import { TasksHelper } from '../../../core/helpers/tasks.helper';
import { dialog_width } from '../../../core/constants';
import { UsersService } from '../../../core/services/users.service';
@Component({
  selector: 'app-tasks-analytics',
  standalone: true,
  imports: [CommonModule, TaskColumnComponent, TaskFilterPipe],
  providers: [DialogService],
  templateUrl: './tasks-analytics.component.html',
  styleUrl: './tasks-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksAnalyticsComponent {
  ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);
  private tasksService = inject(TasksService);
  readonly statusOptions = TasksHelper.statuses;
  readonly priorityOptions = TasksHelper.priorities;
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
  usersService = inject(UsersService);
  addTask(): void {
    this.usersService.getUsers();
    this.ref = this.dialogService.open(UpdateTaskComponent, {
      header: 'Add New Task',
      width: `${dialog_width}%`,
      height: 'auto',
      data: {
        element: this.tasks()[0],
        users: this.usersService.users
      }
    });

  }
}

