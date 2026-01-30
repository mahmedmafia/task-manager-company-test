import { Component, inject, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { TasksService } from '../../core/services/tasks.service';
import { Task, TaskPriority, TaskStatus } from '../../core/models/tasks.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TasksHelper } from '../../core/helpers/tasks.helper';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { User } from '../../core/models/user.model';


@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CalendarModule, MultiSelectModule],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
    this.initForm();
  }
  dialogValue:Task| null=null
  ngOnInit(): void {
    this.dialogValue=this.dialogData?.data.element;
    this.users = this.dialogData?.data.users;
  }
  form!: FormGroup;
  private dialogData = inject(DynamicDialogConfig, { optional: true });
  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private ref = inject(DynamicDialogRef, { optional: true });
  users=signal<User[]>([]);
  statuses = TasksHelper.statuses.filter(s => s.value !== 'all');
  priorities = TasksHelper.priorities.filter(p => p.value !== 'all');
  initForm() {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: [''],
      status: ['todo' as TaskStatus, Validators.required],
      priority: ['medium' as TaskPriority, Validators.required],
      dueDate: [new Date(), Validators.required],
      tags: [''],
      assignee: [this.users()[0], Validators.required]
    });
    if(this.dialogValue){
      this.form.addControl('id',new FormControl(''))
      this.form.patchValue(this.dialogValue);
    }
  }
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
    if (this.form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    // normalize tags to array
    const payload: Partial<any> = {
      title: value.title,
      description: value.description,
      status: value.status,
      priority: value.priority,
      dueDate: value.dueDate.toISOString().split('T')[0],
      tags: this.tags || [],
      assignee: value.assignee
    };

    this.tasksService.addTask(payload).subscribe({
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
