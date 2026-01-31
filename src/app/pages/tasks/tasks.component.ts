import { Component } from '@angular/core';
import { TasksAnalyticsComponent } from './tasks-analytics/tasks-analytics.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TasksAnalyticsComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

}
