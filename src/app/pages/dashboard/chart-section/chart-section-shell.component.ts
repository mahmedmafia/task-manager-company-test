import { CommonModule } from '@angular/common';
import { Component, signal, Type, afterNextRender, AfterViewInit } from '@angular/core';
import { ChartSkeletonComponent } from './chart-skeleton.component';

@Component({
  selector: 'app-chart-section-shell',
  standalone: true,
  imports: [CommonModule,ChartSkeletonComponent],
  template: `
    @defer(on timer(100ms)){
      <ng-container *ngComponentOutlet="chartsComponent" />
    } @placeholder {
      <app-chart-skeleton></app-chart-skeleton>
    }
  `,
})
export class ChartSectionShellComponent implements AfterViewInit {
  chartsComponent: any;
  async ngAfterViewInit() {
      const cmp = await import('./chart-section.component');
      this.chartsComponent = cmp.ChartSectionComponent;
  }
}
