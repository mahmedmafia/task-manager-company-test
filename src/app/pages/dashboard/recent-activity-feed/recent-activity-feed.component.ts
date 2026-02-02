import { Component, computed, inject } from '@angular/core';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../core/models/tasks.model';
import { comparedDate, getDiffInDays } from '../../../core/utils/shared.util';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarProfileComponent } from "../../../components/avatar-profile/avatar-profile.component";

@Component({
  selector: 'app-recent-activity-feed',
  standalone: true,
  imports: [CommonModule, SkeletonModule, AvatarProfileComponent],
  templateUrl: './recent-activity-feed.component.html',
  styleUrl: './recent-activity-feed.component.scss'
})
export class RecentActivityFeedComponent {
  taskServ = inject(TasksService);
  constructor() {
    this.taskServ.getTasks();
  }
  tasks = computed(() => this.taskServ.tasks().tasks);

  feed = computed(() => this.generateActivities(this.tasks()));
  generateActivities(tasks: Task[]) {
    const activities: { taskTitle: string, taskId: string, action: string, date: string, assignee: string }[] = [];
    tasks.sort((a, b) => comparedDate(b.updatedAt, a.updatedAt)).forEach(t => {
      const createdAt = new Date(t.createdAt).toISOString().split('T')[0];
      const updatedAt = new Date(t.updatedAt).toISOString().split('T')[0];
      let action = 'created';
      if (t.completedAt) {
        action = 'completed';
      } else if (createdAt == updatedAt) {
        action = 'created';
      } else if (createdAt != updatedAt) {
        action = 'updated';
      }
      activities.push({
        taskId: t.id,
        taskTitle: t.title,
        action: action,
        date: updatedAt,
        assignee: t.assignee?.name ?? '',
      });
    });
    return activities;
  }
}
