import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input,  signal,  Signal } from '@angular/core';
import { Task } from '../../core/models/tasks.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements AfterViewInit {
  overDueText=signal<string>('');
  ngAfterViewInit(): void {
    if(this.task){
      this.overDueText.set(this.getOverdueDays(this.task.dueDate));
    }
  }
  @Input({ required: true }) task!: Task;
  isOverDue=signal<boolean>(false);

  getOverdueDays(dueDate: string): string {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - due.getTime();
    const diffInDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffInDays == 0) {
      return '📅 Due Today';
    }
    const timeUnit = diffInDays % 7 == 0  ? 'weeks' : 'days';
    this.isOverDue.set(diffInDays > 0);
    return diffInDays > 0 ? `⚠️ Overdue by ${Math.abs(diffInDays)} ${timeUnit}` : `📅 Due in ${Math.abs(diffInDays)} ${timeUnit}`;
  }

}
