import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, signal, Signal } from '@angular/core';
import { Task } from '../../core/models/tasks.model';
import { AvatarProfileComponent } from "../avatar-profile/avatar-profile.component";

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, AvatarProfileComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements AfterViewInit {
  overDueText = signal<string>('');
  ngAfterViewInit(): void {
    if (this.task) {
      this.overDueText.set(this.getOverdueDays(this.task));
    }
  }
  @Input({ required: true }) task!: Task;
  getOverdueDays(task: Task): string {
    let diffInDays = 0;
    let result: string;
    let prefix: string;
    const getDescription = (days: number): string => {
      const absDays = Math.abs(days);
      if (absDays === 0) return '';
      if (absDays % 7 === 0) {
        const weeks = absDays / 7;
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
      }
      return `${absDays} day${absDays > 1 ? 's' : ''}`;
    };
    if (task.status === 'done' && task.completedAt) {
      diffInDays = this.getDiffInDays(task.completedAt);
      prefix = '✅ completed';
      result = `${prefix} ${getDescription(diffInDays)} ago`;

    } else {
      prefix = '📅 due';
      diffInDays = this.getDiffInDays(task.dueDate);
      result = diffInDays > 0 && ![0, 1].includes(diffInDays) ? `⚠️ Overdue by ${getDescription(diffInDays)}` : `${prefix} in ${getDescription(diffInDays)}`;
    }
    switch (diffInDays) {
      case 0:
        result = `${prefix} today`;
        break;
      case 1:
        result = `${prefix} yesterday`;
        break;
    }
    return result;

  }
  getDiffInDays(data: string): number {
    const due = new Date(data);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - due.getTime();
    const diffInDays = diffMs / (1000 * 60 * 60 * 24);
    return diffInDays;
  }
}
