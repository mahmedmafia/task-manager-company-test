import { Injectable, Signal, inject, signal } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UpdateTaskComponent } from "../../components/update-task/update-task.component";
import { dialog_width } from "../constants";
import { Task } from "../models/tasks.model";

@Injectable({ providedIn: 'root' })
export class TaskDialogService {
  private dialogService = inject(DialogService);
  open(element?: Task): DynamicDialogRef {

    return this.dialogService.open(UpdateTaskComponent, {
      header: element ? 'Add New Task' : "Edit Task",
      width: `${dialog_width}%`,
      height: 'auto',
      data: {
        element,
      }
    });
  }
}
