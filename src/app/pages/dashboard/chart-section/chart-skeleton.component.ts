import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-skeleton',
  standalone: true,
  imports: [SkeletonModule, CommonModule],
  template: `
    <div class="charts_container bg-white mt-3">
      <div class="btn-container pt-2 mx-auto">
        <div class="btn-group d-flex justify-content-center">
          <p-skeleton width="80px" height="36px"></p-skeleton>
          <p-skeleton width="80px" height="36px"></p-skeleton>
        </div>
      </div>
      <div class="row mt-0">
        <!-- Pie chart placeholder -->
        <div class="col-lg-3">
          <div class="card pie_card p-2 chart-container rounded-1">
            <p-skeleton width="100%" height="200px"></p-skeleton>
          </div>
        </div>

        <!-- Bar chart placeholder -->
        <div class="col-lg-9">
          <div class="card p-2 chart-container rounded-1">
            <p-skeleton width="100%" height="200px"></p-skeleton>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChartSkeletonComponent {}
