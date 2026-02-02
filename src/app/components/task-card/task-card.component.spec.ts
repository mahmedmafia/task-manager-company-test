import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { configureGlobalTestingModule } from '../../../test';
import { Task } from '../../core/models/tasks.model';
import { TaskDialogService } from '../../core/services/task-dialog.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TasksService } from '../../core/services/tasks.service';

export const dynamicDialogRefMock = {
  onClose: of(true)  // Observable for afterClosed
} as unknown as DynamicDialogRef;
export const taskDialogServiceMock = {
  open: jasmine.createSpy('open').and.returnValue(dynamicDialogRefMock)
}
const expectedTask: Partial<Task> = {
  isOverdue: false,
  id: 'task-001'
}
describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let confirmationMock = { confirm: () => { } };
  let taskServMock: { deleteTask: jasmine.Spy };
  let messageServMock: { add: jasmine.Spy };
  let confirmSpy: jasmine.Spy;
  let mockEvent = { target: document.createElement('button') } as unknown as Event;
  beforeEach(async () => {
    taskServMock = { deleteTask: jasmine.createSpy('deleteTask') };
    messageServMock = { add: jasmine.createSpy('add') };
    await configureGlobalTestingModule({
      imports: [TaskCardComponent],
      providers: [
        {
          provide: TaskDialogService,
          useValue: taskDialogServiceMock
        },
        {
          provide: DialogService,
          useValue: dynamicDialogRefMock
        },
        { provide: ConfirmationService, useValue: confirmationMock },
        { provide: TasksService, useValue: taskServMock },
        { provide: MessageService, useValue: messageServMock },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TaskCardComponent);
    const compConfirmServ = fixture.debugElement.injector.get(ConfirmationService);
    confirmSpy = spyOn(compConfirmServ, 'confirm');
    component = fixture.componentInstance;
    component.task = expectedTask as any;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  function openMenu() {
    const compiled = fixture.nativeElement as HTMLElement;
    const openMenuBtn = compiled.querySelector('.menu-btn') as HTMLButtonElement;
    openMenuBtn.click();
    fixture.detectChanges();
  }
  it('when click card options it shows menu with two buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    openMenu();
    expect(compiled.querySelector('#editBtn')).toBeTruthy();
    expect(compiled.querySelector('#deleteBtn')).toBeTruthy();
  })
  it('when click edit task it should open dialog to update', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    openMenu();
    (compiled.querySelector('#editBtn') as HTMLButtonElement).click();
    expect(taskDialogServiceMock.open).toHaveBeenCalledWith(expectedTask);
  });
  it('when click delete task it should trigger Delete ', () => {
    const deleteSpy = spyOn(component, 'deleteTask').and.callFake(() => { });
    const compiled = fixture.nativeElement as HTMLElement;
    openMenu();
    (compiled.querySelector('#deleteBtn') as HTMLButtonElement).click();
    expect(deleteSpy).toHaveBeenCalledWith(jasmine.any(Event));
  })
  it('should call confirmation service when deleteTask is triggered', () => {
    const event = { target: document.createElement('button'), x: 'hi' } as unknown as Event;

    component.deleteTask(event);
    fixture.detectChanges();
    expect(confirmSpy).toHaveBeenCalled();
    const arg = confirmSpy.calls.mostRecent().args[0];
    expect(arg.key).toBe('confirm1');
    expect(arg.target).toBe(event.target);
  });
  it('should call taskServ.deleteTask and show success message on accept', fakeAsync(() => {
    taskServMock.deleteTask.and.returnValue(of({}));
    component.deleteTask(mockEvent);
    const confirmArg = confirmSpy.calls.mostRecent().args[0];
    confirmArg.accept();
    tick();
    expect(taskServMock.deleteTask).toHaveBeenCalledWith(expectedTask.id);
    expect(messageServMock.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success', summary: 'Success' })
    );
  }));
  it('should not call taskServ.deleteTask if rejected', () => {
    component.deleteTask(mockEvent);
    const confirmArg = confirmSpy.calls.mostRecent().args[0];
    confirmArg.reject?.();
    expect(taskServMock.deleteTask).not.toHaveBeenCalled();
    expect(messageServMock.add).not.toHaveBeenCalled();
  });
  it('should show error message if deleteTask fails', fakeAsync(() => {
    taskServMock.deleteTask.and.returnValue(throwError(() => new Error('Failed')));

    component.deleteTask(mockEvent);
    const confirmArg = confirmSpy.calls.mostRecent().args[0];
    confirmArg.accept();
    tick();
    expect(taskServMock.deleteTask).toHaveBeenCalledWith(expectedTask.id);
    expect(messageServMock.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'danger', summary: 'Fail' })
    );
  }));
});
