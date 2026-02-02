import { Component, computed, effect, inject, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {
  constructor() {
    this.usersService.getUsers();
  }


  today: Date = new Date();
  editElement: User | null = null
  usersService = inject(UsersService);
  users = computed(() => this.usersService.users() || [])
  ngOnInit(): void {
    this.editElement = this.dialogData?.data.element;
    this.initForm();
  }
  form!: FormGroup;
  private dialogData = inject(DynamicDialogConfig, { optional: true });
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef, { optional: true });

  initForm() {
    this.form = this.fb.nonNullable.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
    });

    if (this.editElement) {
      this.form.addControl('id', new FormControl(''))
      this.form.addControl('avatar', new FormControl(''))

      this.form.patchValue(this.editElement);
    }
  }

  success = false;
  errorMessage = '';
  isLoading = false;
  close() {
    this.ref?.close();
  }

  save() {
    this.isLoading = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    const name: string = value.name;
    value.avatar = (name.split(' ').length > 1 ? name.split(' ').map(s => s[0]).join('') : name.slice(0, 2)).toUpperCase();
    const payload: Partial<User> = {
      ...value,
    };
    let updateUser$;
    if (this.editElement && this.editElement.id) {
      updateUser$ = this.usersService.updateUser(this.editElement.id, payload);
    } else {
      updateUser$ = this.usersService.addUser(payload);
    }
    updateUser$.subscribe({
      next: (created) => {
        this.success = true;
        this.isLoading = false;
        this.ref?.close(created);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Failed to create task';
        this.isLoading = false;
      }
    });
  }
}
