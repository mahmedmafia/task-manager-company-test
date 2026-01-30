import { TaskPriority, TaskStatus } from "../models/tasks.model";

export type TaskFilterStatus = (TaskStatus | 'all');
export type TaskFilterPriority = (TaskPriority | 'all');

export class TasksHelper {
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

  private constructor() {}


}
