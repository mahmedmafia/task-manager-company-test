import { Component, computed, inject } from '@angular/core';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../core/models/tasks.model';
import { comparedDate, getDiffInDays } from '../../../core/utils/shared.util';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recent-activity-feed',
  standalone: true,
  imports: [CommonModule,SkeletonModule],
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
    const activities: {taskTitle:string,taskId:string,action:string,date:string}[] = [];
    tasks.sort((a, b) => comparedDate(b.updatedAt, a.updatedAt)).forEach(t => {
      if (t.completedAt) {
        activities.push({
          taskId: t.id,
          taskTitle: t.title,
          action: 'completed',
          date: t.updatedAt
        });
      } else if (t.createdAt == t.updatedAt) {
        activities.push({
          taskId: t.id,
          taskTitle: t.title,
          action: 'created',
          date: t.updatedAt,
        })
      } else if (t.createdAt != t.updatedAt) {
        activities.push({
          taskId: t.id,
          taskTitle: t.title,
          action: 'updated',
          date: t.updatedAt,
        })
      }
    });
    return activities;
  }
}
