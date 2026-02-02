import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../core/services/tasks.service';
import { TasksUtils } from '../../../core/utils/tasks.util';
import { Task } from '../../../core/models/tasks.model';
import { UsersService } from '../../../core/services/users.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [ChartModule, ButtonModule, FormsModule, CommonModule],
  templateUrl: './chart-section.component.html',
  styleUrl: './chart-section.component.scss'
})
export class ChartSectionComponent {
  data: any;
  baseOptions: any;
  taskServ = inject(TasksService);
  userServ = inject(UsersService);


  constructor() {
    this.taskServ.getTasks();
    this.userServ.getUsers();
  }
  tasks = computed(() => this.taskServ.tasks().tasks);

  filter = signal<'status' | 'priority'>('status');

  filterOptions = [
    { label: 'Status', value: 'status' },
    { label: 'Priority', value: 'priority' }
  ];

  /* View toggle to show per-user chart */
  view = signal<'overview' | 'byUser'>('byUser');
  viewOptions = [
    { label: 'Overview', value: 'overview' },
    { label: 'By User', value: 'byUser' }
  ];

  /* Colors for priority and status series */
  readonly priorityColors: Record<string, string> = {
    low: '#42A5F5',
    medium: '#FFB300',
    high: '#F44336'
  };

  readonly statusColors: Record<string, string> = {
    todo: '#90A4AE',
    in_progress: '#29B6F6',
    done: '#66BB6A'
  };
  taskChartOptions = computed(() => {
    const titleText = 'Tasks By ' + (this.filter() === 'priority' ? 'Priority' : 'Status');
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        afterDatasetsDraw: (ch: any) => {
          console.log(ch);
        },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 14 },
          formatter: (value: number, ctx: any) => {
            console.log('hi');
            const dataArr = ctx.chart.data.datasets[0].data;
            const sum = dataArr.reduce((a: number, b: number) => a + b, 0);
            const percentage = (value * 100 / sum).toFixed(1) + '%';
            return percentage;
          },
        },
        title: {
          display: true,
          text: titleText,
        }
      }
    }
  });

  tasksChartData = computed(() => {
    let labels: string[] = [];
    let data: number[] = [];
    const tasks = this.tasks();
    const filter = this.filter();
    const count = this.countByPropert(tasks, filter);
    let arr = filter == 'priority' ? TasksUtils.priorities : TasksUtils.statuses;
    const backgroundColor: string[] = [];
    arr.forEach(x => {
      if (x.value == 'all') return;
      labels.push(x.label);
      data.push(count[x.value] ?? 0);
      const color = filter === 'priority' ? this.priorityColors[x.value] : this.statusColors[x.value];
      backgroundColor.push(color);
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        hoverBackgroundColor: backgroundColor
      }]
    };
  });

  usersChartData = computed(() => {
    const tasks = this.tasks();
    const breakdown = this.filter();
    const usersMap = new Map<string, any>();
    tasks.forEach(t => usersMap.set(t.assignee.id, t.assignee));
    const users = Array.from(usersMap.values());
    const labels = users.map((u: any) => u.name);

    const series = (breakdown === 'priority' ? TasksUtils.priorities : TasksUtils.statuses)
      .filter(s => s.value !== 'all');

    const datasets = series.map(s => {
      const key = s.value as string;
      const color = breakdown === 'priority' ? this.priorityColors[key] : this.statusColors[key];
      const data = users.map((u: any) => tasks.filter(t => t.assignee.id === u.id && t[breakdown] === key).length);
      return {
        label: s.label,
        data,
        type: 'bar',
        borderColor: color,
        backgroundColor: color,
        fill: true,
        tension: 0.3
      };
    });

    return { labels, datasets };
  });

  usersChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Tasks per User by ' + (this.filter() === 'priority' ? 'Priority' : 'Status')
      },
      tooltip: { mode: 'index', intersect: false }
    }
  }));


  private countByPropert(tasks: Task[], prop: 'status' | 'priority') {
    return tasks.reduce((acc, task) => {
      const key = task[prop];
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
  pastValue = '';
  changed(event: any) {
    if (event == null) {
      event = this.pastValue;
    }
    this.pastValue = event;

    this.filter.set(event);
  }
}
