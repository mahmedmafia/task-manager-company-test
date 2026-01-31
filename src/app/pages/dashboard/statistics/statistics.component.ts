import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Stat, StatisticsService } from './statistics.service';
import { map, Observable } from 'rxjs';
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
  statistics$!: Observable<Stat[]>;

  ngOnInit() {
    this.statistics$ = this.statsService.getStatistics().pipe(map(response => response.statistics));
  }
  trackByStatId(index: number, stat: Stat): string {
    return stat.id;
  }
}
