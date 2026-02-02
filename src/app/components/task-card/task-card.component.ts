import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, signal, Signal } from '@angular/core';
import { Task } from '../../core/models/tasks.model';
import { AvatarProfileComponent } from "../avatar-profile/avatar-profile.component";
import { TasksUtils } from '../../core/utils/tasks.util';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskDialogService } from '../../core/services/task-dialog.service';
import { UsersService } from '../../core/services/users.service';
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TasksService } from '../../core/services/tasks.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, AvatarProfileComponent, OverlayPanelModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements AfterViewInit {
  @Input({ required: true }) task!: Task;
  ref: DynamicDialogRef | undefined;
  messageServ = inject(MessageService);
  taskDialogService = inject(TaskDialogService);
  usersService = inject(UsersService);
  overDueText = signal<string>('');
  confirmationServ = inject(ConfirmationService);
  taskServ = inject(TasksService);
  ngAfterViewInit(): void {
    if (this.task) {
      this.overDueText.set(TasksUtils.getOverdueText(this.task));
    }
  }

  editTask(t: any): void {
    this.ref = this.taskDialogService.open(this.task);
  }
  deleteTask(event: Event) {
    this.confirmationServ.confirm({
      key: 'confirm1',
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      rejectButtonStyleClass: "p-button-sm p-button-sm",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.taskServ.deleteTask(this.task.id).subscribe({
          next: (res) => {
            this.messageServ.add({ severity: 'success', summary: 'Success', detail: undefined, life: 1000 });
          }, error: (err) => {
            this.messageServ.add({ severity: 'danger', summary: 'Fail', detail: undefined, life: 1000 });

          }
        });
      },
    });
  }
}
