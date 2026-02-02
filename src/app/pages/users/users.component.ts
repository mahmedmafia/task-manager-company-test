import { Component, computed, inject, signal } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from 'primeng/button';
import { User } from '../../core/models/user.model';
import { DialogService } from 'primeng/dynamicdialog';
import { dialog_width } from '../../core/constants';
import { UpdateUserComponent } from './update-user/update-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DropdownModule, TableModule, CommonModule, FormsModule, TooltipModule, ButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  usersServ = inject(UsersService);
  tasksServ = inject(TasksService);
  dialogService = inject(DialogService);
  sortField = signal({ order: 1, field: '' });
  users = computed(() => {
    const users = this.usersServ.users();
    const sortField = this.sortField();
    const order = sortField.order;
    return [...users].sort((a, b) => {
      const countA = this.getAssignedTasksCount(a.id);
      const countB = this.getAssignedTasksCount(b.id);

      return order * (countA - countB);
    });

  }
  );
  tasks = computed(() => this.tasksServ.tasks().tasks);

  selectedTaskId = signal<Record<string, string>>({});

  ngOnInit() {
    this.usersServ.getUsers();
    this.tasksServ.getTasks();
  }
  getAssignedTasksCount(userId: string) {
    return this.tasks().filter(x => x.assignee.id == userId).length;
  }
  onCustomSort(field: string) {

    if (field === 'assignedTasks') {
      this.sortField.update(x => {
        x.field = field;
        x.order = x.order * -1;
        return { ...x };
      })
    }
  }
  update(element: User | null = null) {
    const ref= this.dialogService.open(UpdateUserComponent, {
      header: element ? 'Edit User' : "Add New User",
      width: `40%`,
      height: 'auto',
      data: {
        element,
      }
    });
  }
}
