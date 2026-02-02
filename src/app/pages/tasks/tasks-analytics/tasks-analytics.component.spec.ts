import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TasksAnalyticsComponent } from './tasks-analytics.component';
import { configureGlobalTestingModule } from '../../../../test';
import { TaskDialogService } from '../../../core/services/task-dialog.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TasksService } from '../../../core/services/tasks.service';
import { UsersService } from '../../../core/services/users.service';
import { signal } from '@angular/core';
import { Task } from '../../../core/models/tasks.model';
import { User } from '../../../core/models/user.model';
import { of } from 'rxjs';
export const dynamicDialogRefMock = {
  onClose: of(true)  // Observable for afterClosed
} as unknown as DynamicDialogRef;
export const taskDialogServiceMock = {
  open: jasmine.createSpy('open').and.returnValue(dynamicDialogRefMock)
}
describe('TasksAnalyticsComponent', () => {
  let component: TasksAnalyticsComponent;
  let fixture: ComponentFixture<TasksAnalyticsComponent>;
  let mockTasksService: jasmine.SpyObj<TasksService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  const tasksSignal = signal<{ tasks: Task[] }>({ tasks: [] })
  const usersSignal = signal<{ users: User[] }>({ users: [] })
  beforeEach(async () => {
    mockTasksService = jasmine.createSpyObj('TasksService', [
      'getTasks',
      'tasks',
      'taskSearch'
    ]);

    mockUsersService = jasmine.createSpyObj('UsersService', [
      'getUsers',
      'users'
    ]);
    await configureGlobalTestingModule({
      imports: [TasksAnalyticsComponent],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: TaskDialogService,
          useValue: taskDialogServiceMock
        },
        {
          provide: DialogService,
          useValue: dynamicDialogRefMock
        },
      ]
    })
      .compileComponents();

    mockTasksService.tasks.and.callFake(tasksSignal as any)
    mockUsersService.users.and.callFake(usersSignal as any)
    mockTasksService.taskSearch.and.returnValue('');
    mockUsersService.users.and.returnValue([]);
    fixture = TestBed.createComponent(TasksAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call getTasks and getUsers on init', () => {
    expect(mockTasksService.getTasks).toHaveBeenCalled();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
  });
  it('should expose tasks from service', fakeAsync(() => {
    const tasksMock = [
      { id: '1', title: 'Task', description: 'Desc', priority: 'medium' }
    ] as any;

    tasksSignal.set({ tasks: tasksMock });
    tick();
    fixture = TestBed.createComponent(TasksAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.tasks()).toEqual(tasksMock);
  }));
  it('when click edit task it should open dialog to update', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.new-task') as HTMLButtonElement).click();
    expect(taskDialogServiceMock.open).toHaveBeenCalledWith(undefined);
  });
  it('should filter tasks by priority, user and search', () => {
    const tasksMock = [
      {
        id: '1',
        title: 'Angular Task',
        description: 'Signals',
        priority: 'high',
        assignee: { id: '1' }
      },
      {
        id: '2',
        title: 'React Task',
        description: 'Hooks',
        priority: 'low',
        assignee: { id: '2' }
      }
    ] as any;

    tasksSignal.set({ tasks: tasksMock });
    mockTasksService.taskSearch.and.returnValue('angular');

    fixture = TestBed.createComponent(TasksAnalyticsComponent);
    component = fixture.componentInstance;

    component.priorityFilter.set('high');
    component.userFilter.set('1');

    const result = component.filteredTasks();

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Angular Task');
  });
  it('it should display column based on status Filter',()=>{
      component.statusFilter.set('todo');
      fixture.detectChanges();
      const compiled=fixture.nativeElement as HTMLElement;
      expect(compiled.querySelectorAll('app-task-column').length).toBe(1);
      expect(component.statuses().length).toBe(1);
  })
  it('it should display All column if selected all',()=>{
    component.statusFilter.set('all');
    fixture.detectChanges();
    const compiled=fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-task-column').length).toBe(3);
    expect(component.statuses().length).toBe(3);
})
});
