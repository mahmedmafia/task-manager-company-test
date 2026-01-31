import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/tasks.model';

@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {

  transform(value: Task[], status: TaskStatus | 'all'): Task[] {
    return (value ?? []).filter(task => {
        return (status == 'all' || !status || task.status === status);

    });
  }

}
