import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../core/models/tasks.model';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule,TaskCardComponent],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaskColumnComponent {
 @Input() title: string = '';
 @Input() tasks: Task[] = [];
}
