import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Stat, StatisticsService } from './statistics.service';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  providers:[DialogService],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  statsService = inject(StatisticsService);

  ngOnInit() {
    this.statsService.getStatistics();
  }
  trackByStatId(index: number, stat: Stat): string {
    return stat.id;
  }
}
