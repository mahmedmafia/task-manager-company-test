import { Component, inject, OnInit, AfterViewInit, signal, computed, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { TasksService } from '../../core/services/tasks.service';
import { Task, TaskPriority, TaskStatus } from '../../core/models/tasks.model';
import {  DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TasksUtils } from '../../core/helpers/tasks.util';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { UsersService } from '../../core/services/users.service';
import { getDiffInDays } from '../../core/helpers/shared.util';


@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CalendarModule, MultiSelectModule],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent implements OnInit {
  constructor() {
    this.usersService.getUsers();
  }

  private _autoAssign = effect(() => {
    const users = this.users();
    if (users?.length && this.form) {
      this.form.get('assignee')?.setValue(this.editElement ? users.find(x => x.id == this.editElement?.assignee.id) : users[0])
    }
  });
  today: Date = new Date();
  editElement: Task | null = null
  usersService = inject(UsersService);
  users = computed(() => this.usersService.users() || [])
  ngOnInit(): void {
    this.editElement = this.dialogData?.data.element;
    this.initForm();
  }
  form!: FormGroup;
  private dialogData = inject(DynamicDialogConfig, { optional: true });
  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private ref = inject(DynamicDialogRef, { optional: true });
  statuses = TasksUtils.statuses.filter(s => s.value !== 'all');
  priorities = TasksUtils.priorities.filter(p => p.value !== 'all');
  initForm() {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['',Validators.required],
      status: ['todo' as TaskStatus, Validators.required],
      priority: ['medium' as TaskPriority, Validators.required],
      dueDate: [new Date(), Validators.required],
      tags: [''],
      assignee: [this.users()[0], Validators.required]
    });
    this.form.get('status')?.valueChanges.subscribe((res: TaskStatus) => {
      if (res == 'done') {
        this.form.addControl('completedAt', new FormControl(null, Validators.required));
        setTimeout(() => {
          this.form.get('completedAt')?.setValue(this.today);
          this.isCompletedAt.set(true);
        }, 10)
      } else {
        this.form.removeControl('completedAt', { emitEvent: false });
        this.isCompletedAt.set(false);

      }
      this.form.updateValueAndValidity();
    })
    if (this.editElement) {
      this.form.addControl('id', new FormControl(''))
      this.tags=this.editElement.tags;
      this.form.patchValue({...this.editElement,tags:''}, { emitEvent: true });
    }
  }
  isCompletedAt=signal(false);
  tags: string[] = [];
  addTag(tag: string) {
    const value = (tag || '').toString().trim();
    if (!value) return;
    if (!this.tags.includes(value)) {
      this.tags.push(value);
    }
    this.form.get('tags')?.setValue('');
  }
  removeTag(tag: string) {
    this.tags = this.tags.filter(x => x !== tag);
  }
  success = false;
  errorMessage = '';
  isLoading = false;
  close() {
    this.ref?.close();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    const dueDate =new Date(value.dueDate).toISOString().split('T')[0];
    const payload: Partial<Task> = {
      ...value,
      dueDate,
      tags: this.tags || [],
      isOverdue: getDiffInDays(dueDate) > 0,
      updatedAt:new Date().toISOString(),
    };
    if (payload.status == 'done') {
      delete payload.isOverdue;
    }
    let updateTask$;
    if (this.editElement && this.editElement.id) {
      updateTask$ = this.tasksService.updateTask(this.editElement.id, payload);
    } else {
      payload.createdAt=new Date().toISOString();
      updateTask$ = this.tasksService.addTask(payload);
    }
    updateTask$.subscribe({
      next: (created) => {
        this.success = true;
        this.isLoading = false;
        // close dialog and return created task
        this.ref?.close(created);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Failed to create task';
        this.isLoading = false;
      }
    });
  }
}
