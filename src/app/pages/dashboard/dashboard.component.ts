import { Component } from '@angular/core';
import { StatisticsComponent } from "./statistics/statistics.component";
import { TasksAnalyticsComponent } from "./tasks-analytics/tasks-analytics.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticsComponent, TasksAnalyticsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
