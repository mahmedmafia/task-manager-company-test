import { afterNextRender, Component, signal } from '@angular/core';
import { StatisticsComponent } from "./statistics/statistics.component";
import { RecentActivityFeedComponent } from "./recent-activity-feed/recent-activity-feed.component";
import { ChartSectionShellComponent } from './chart-section/chart-section-shell.component';
import {SkeletonModule} from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticsComponent, ChartSectionShellComponent, RecentActivityFeedComponent, SkeletonModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
