import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateTaskComponent } from './update-task.component';
import { FormBuilder } from '@angular/forms';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { configureGlobalTestingModule } from '../../../test';
import { Task } from '../../core/models/tasks.model';
import { deepCompare } from '../../core/helpers/shared.util';

const mockTasksService = {
  addTask: jasmine.createSpy('addTask').and.returnValue(of({ id: 1 })),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(of({ id: 1 })),
};

const mockUsersService = {
  users: jasmine.createSpy('users').and.returnValue([{ id: 1, name: 'John' }]),
  getUsers: jasmine.createSpy('getUsers'),
};

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};

const mockDialogConfig = {
  data: { element: null } // optional, can pass edit task
};

describe('UpdateTaskComponent', () => {
  let component: UpdateTaskComponent;
  let fixture: ComponentFixture<UpdateTaskComponent>;
  let mockTask = {
    title: 'Task 1',
    description: 'Desc',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    tags: [],
    assignee: { id: '1', name: 'John', email: '', avatar: '' },
  };
  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [UpdateTaskComponent], // standalone import
      providers: [
        FormBuilder,
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  describe('Handle From', () => {
    it('should initialize the form with default values', () => {
      expect(component.form).toBeTruthy();
      expect(component.form.get('dueDate')?.value.toISOString().split('T')[0]).toEqual(new Date().toISOString().split('T')[0]);
      expect(component.form.get('assignee')?.value).toEqual({ id: 1, name: 'John' });
    });
    it('should add completedAt when status changes to done', fakeAsync(() => {
      component.form.get('status')?.setValue('done');
      tick(20);
      expect(component.form.get('completedAt')).toBeTruthy();
      expect(component.isCompletedAt()).toBeTrue();
    }));
    it('should add a tag', () => {
      component.addTag('urgent');
      expect(component.tags).toContain('urgent');
      expect(component.form.get('tags')?.value).toBe('');
    });

    it('should remove a tag', () => {
      component.tags = ['tag1', 'tag2'];
      component.removeTag('tag1');
      expect(component.tags).toEqual(['tag2']);
    });

    it('should close dialog when close() is called', () => {
      component.close();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should make submit disabled if form is invalid', () => {
      component.form.markAllAsTouched();
      component.form.markAsDirty();
      const button = fixture.nativeElement.querySelector('.save') as HTMLButtonElement;
      expect(component.form.invalid).toBeTrue();
      expect(button.disabled).toBeTrue();

    });


  })
  describe('Create Task', () => {
    it('should call addTask when creating new task', fakeAsync(() => {
      component.form.patchValue({
        title: 'Task 1',
        description: 'Desc',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(),
        tags: '',
        assignee: { id: 1, name: 'zzz' },
      });
      component.save();
      expect(mockTasksService.addTask).toHaveBeenCalled();
    }));
  })
  describe('Update Task', () => {
    beforeEach(async () => {
      component.editElement = {
        ...mockTask as any,
        id: 'task-1',
        dueDate: new Date().toISOString().split('T')[0]
      }

      component.initForm();
    });
    it('should update Form Value with input Element', () => {

      expect(deepCompare(component.form.value, { ...component.editElement, tags: '' })).toBeTrue();
      expect(deepCompare(component.tags, component.editElement?.tags)).toBeTrue();

    })
    it('should call update task when saving', fakeAsync(() => {
      component.form.patchValue(mockTask);

      component.save();
      tick();

      expect(mockTasksService.updateTask).toHaveBeenCalled();
      expect(component.success).toBeTrue();
      expect(mockDialogRef.close).toHaveBeenCalled();
    }));
  })
  describe('Save Task', () => {
    it('should reponse error and display it on Html', fakeAsync(() => {
      mockTasksService.addTask.and.returnValue(throwError(() => new Error('Failed')));
      component.form.patchValue(mockTask);
      component.save();
      tick();
      expect(component.errorMessage).toBe('Failed');
      expect(component.isLoading).toBeFalse();
    }));
    it('should handle custom error and display it on Html if no response found', fakeAsync(() => {
      mockTasksService.addTask.and.returnValue(throwError(() => new Error()));
      component.form.patchValue(mockTask);
      component.save();
      tick();
      expect(component.errorMessage).toBe('Failed to create task');
      expect(component.isLoading).toBeFalse();
    }));
    it('should remove overdue when task is completed', () => {
      const doneTask = { ...mockTask, status: 'done', isOverdue: true }
      component.form.patchValue(doneTask);
      component.save();
      const payload = { ...doneTask } as any;
      delete payload.isOverdue
      expect(mockTasksService.addTask.calls.mostRecent().args[0].isOverdue).toBeUndefined();
    })

  })


});
