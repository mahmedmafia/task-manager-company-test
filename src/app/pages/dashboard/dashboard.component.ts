import { Component } from '@angular/core';
import { StatisticsComponent } from "./statistics/statistics.component";
import { TasksAnalyticsComponent } from "./tasks-analytics/tasks-analytics.component";
import { ChartSectionComponent } from "./chart-section/chart-section.component";
import { RecentActivityFeedComponent } from "./recent-activity-feed/recent-activity-feed.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticsComponent, TasksAnalyticsComponent, ChartSectionComponent, RecentActivityFeedComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
