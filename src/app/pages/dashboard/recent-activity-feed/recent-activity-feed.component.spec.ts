import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RecentActivityFeedComponent } from './recent-activity-feed.component';
import { TasksService } from '../../../core/services/tasks.service';
import { Task, TasksResponse } from '../../../core/models/tasks.model';
import { configureGlobalTestingModule } from '../../../../test';

describe('RecentActivityFeedComponent', () => {
  let component: RecentActivityFeedComponent;
  let fixture: ComponentFixture<RecentActivityFeedComponent>;
  let mockTasksService: jasmine.SpyObj<TasksService>;

  const tasksSignal = signal<{ tasks: Task[] }>({ tasks: [] });
  beforeEach(async () => {
    mockTasksService = jasmine.createSpyObj('TasksService', [
      'getTasks',
      'tasks'
    ]);
    mockTasksService.tasks.and.callFake(tasksSignal as any);
    await configureGlobalTestingModule({
      imports: [RecentActivityFeedComponent],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getTasks on init', () => {
    expect(mockTasksService.getTasks).toHaveBeenCalled();
  });

  it('should generate CREATED activity when createdAt === updatedAt', () => {
    const task: Task = {
      id: '1',
      title: 'New Task',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      completedAt: null,
    } as unknown as Task;

    tasksSignal.set({ tasks: [task] });

    const feed = component.feed();

    expect(feed[0].action).toBe('created');
  });

  it('should generate UPDATED activity when createdAt !== updatedAt', () => {
    const task: Task = {
      id: '2',
      title: 'Updated Task',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
      completedAt: null,
    } as unknown as Task;

    tasksSignal.set({ tasks: [task] });

    const feed = component.feed();

    expect(feed[0].action).toBe('updated');
  });

  it('should generate COMPLETED activity when completedAt exists', () => {
    const task: Task = {
      id: '3',
      title: 'Completed Task',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-03',
      completedAt: '2024-01-03',
    } as Task;

    tasksSignal.set({ tasks: [task] });

    const feed = component.feed();

    expect(feed[0].action).toBe('completed');
  });

  it('should sort activities by updatedAt', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Older',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        completedAt: null,
      },
      {
        id: '2',
        title: 'Newer',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05',
        completedAt: null,
      },
    ] as unknown as Task[];

    tasksSignal.set({ tasks });

    const feed = component.feed();

    expect(feed[0].taskId).toBe('2');
    expect(feed[1].taskId).toBe('1');
  });
});
