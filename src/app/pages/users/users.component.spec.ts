import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { configureGlobalTestingModule } from '../../../test';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { signal } from '@angular/core';
import { Task } from '../../core/models/tasks.model';
import { User } from '../../core/models/user.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
export const dynamicDialogRefMock = {
  onClose: of(true)  // Observable for afterClosed
} as unknown as DynamicDialogRef;
export const dialogServiceMock = {
  open: jasmine.createSpy('open').and.callFake(() => { })
}
describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockTasksService: jasmine.SpyObj<TasksService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  const tasksSignal = signal<{ tasks: Task[] }>({ tasks: [] })
  const usersSignal = signal<User[]>([])
  let getAssignedTask: jasmine.Spy;
  let mockTask = {
    title: 'Task 1',
    description: 'Desc',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    tags: [],
    assignee: { id: '1', name: 'John', email: '', avatar: '' },
  } as never as Task;
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
      imports: [UsersComponent],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: DialogService,
          useValue: dialogServiceMock
        },
      ]
    })
      .compileComponents();

    mockTasksService.tasks.and.callFake(tasksSignal as any)
    mockUsersService.users.and.callFake(usersSignal as any)
    mockTasksService.tasks.and.returnValue({ tasks: [mockTask], meta: null as any })
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    getAssignedTask = spyOn(component, 'getAssignedTasksCount').and.callFake(() => 1);
    fixture.detectChanges();
  });
  it('should call getTasks and getUsers on init', () => {
    expect(mockTasksService.getTasks).toHaveBeenCalled();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
  });
  it('should expose tasks from service', fakeAsync(() => {
    const tasksMock = [
      mockTask
    ] as any;

    tasksSignal.set({ tasks: tasksMock });
    tick();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.tasks()).toEqual(tasksMock);
  }));

  it('should expose users from service', fakeAsync(() => {
    const mock = [
      { id: '1', name: 'User', email: 'e@e.com', avatar: '' }
    ] as any;
    usersSignal.set(mock);
    tick();
    component.sortField.set({ order: 1, field: '' })
    expect(component.users()).toEqual(mock);
    usersSignal.set([]);
  }));
  it('when click add user it should open dialog to update', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.add') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(dialogServiceMock.open).toHaveBeenCalled();
  });
  it('users sort Order should change based tasks countsort order', fakeAsync(() => {
    const mock = [
      { id: '1', name: 'User1', email: 'e@e.com', avatar: '' },
      { id: '2', name: 'User2', email: 'k@z.com', avatar: '' }

    ] as any[];
    tasksSignal.set({ tasks: [{...mockTask,assignee: { id: '1' } as any }, { ...mockTask, assignee: { id: '2' } as any }, { ...mockTask, assignee: { id: '2' } as any }] })
    usersSignal.set(mock);
    getAssignedTask.and.callThrough();
    component.sortField.set({ field: '', order: -1 });
    tick();
    expect(component.users()).toEqual(mock);
    component.sortField.set({ field: '', order:1 });
    tick();
    expect(component.users()).toEqual(mock.reverse());
  }));

  it('when click add user it should open dialog to update', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const updateSpy = spyOn(component, 'update');
    (compiled.querySelector('.add') as HTMLButtonElement).click();
    expect(updateSpy).toHaveBeenCalled();
  });
});
