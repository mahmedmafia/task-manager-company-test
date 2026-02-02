import { Task, TaskPriority, TaskStatus } from "../models/tasks.model";
import { getDiffInDays } from "./shared.util";

export type TaskFilterStatus = (TaskStatus | 'all');
export type TaskFilterPriority = (TaskPriority | 'all');

export class TasksUtils {
  static readonly statuses: { value: TaskFilterStatus, label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  static readonly priorities: { value: TaskFilterPriority, label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  private constructor() { }
  static getOverdueText(task: Task): string {
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
      diffInDays = getDiffInDays(task.completedAt);
      prefix = '✅ completed';
      result = `${prefix} ${getDescription(diffInDays)} ago`;
    } else {
      prefix = '📅 due';
      diffInDays = getDiffInDays(task.dueDate);
      result =
        diffInDays > 0 && ![0, 1].includes(diffInDays)
          ? `⚠️ Overdue by ${getDescription(diffInDays)}`
          : `${prefix} in ${getDescription(diffInDays)}`;
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

}
