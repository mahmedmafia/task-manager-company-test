import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UpdateUserComponent } from './update-user.component';
import { configureGlobalTestingModule } from '../../../../test';
import { UsersService } from '../../../core/services/users.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';
import { deepCompare } from '../../../core/utils/shared.util';
const mockUsersService = {
  users: jasmine.createSpy('users').and.returnValue([{ id: 1, name: 'John' }]),
  getUsers: jasmine.createSpy('getUsers'),
  updateUser: jasmine.createSpy('addTask').and.returnValue(of({ id: 1 })),
  addUser: jasmine.createSpy('updateTask').and.returnValue(of({ id: 1 })),
};

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};

const mockDialogConfig = {
  data: { element: null } // optional, can pass edit task
};
describe('UpdateUserComponent', () => {
  let component: UpdateUserComponent;
  let fixture: ComponentFixture<UpdateUserComponent>;

  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [UpdateUserComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Handle From', () => {
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
  describe('Create User', () => {
    it('should call addTask when creating new task', fakeAsync(() => {
      component.form.patchValue({
        name: 'AAS',
        email: 't@t.com',
      });
      component.save();
      expect(mockUsersService.addUser).toHaveBeenCalled();
    }));
  })
  let mockUser = {
    name: 'AAA',
    email: 't@t.com',
    avatar: 'AA',
    id: 'user-2'
  };
  describe('Update User', () => {

    beforeEach(async () => {
      component.editElement = mockUser

      component.initForm();
    });
    it('should update Form Value with input Element', () => {

      expect(deepCompare(component.form.value, component.editElement)).toBeTrue();

    })
    it('should call update task when saving', fakeAsync(() => {
      component.form.patchValue(mockUser);

      component.save();
      tick();

      expect(mockUsersService.updateUser).toHaveBeenCalled();
      expect(component.success).toBeTrue();
      expect(mockDialogRef.close).toHaveBeenCalled();
    }));
  })
  describe('Save User', () => {
    it('should reponse error and display it on Html', fakeAsync(() => {
      mockUsersService.addUser.and.returnValue(throwError(() => new Error('Failed')));
      component.form.patchValue(mockUser);
      component.save();
      tick();
      expect(component.errorMessage).toBe('Failed');
      expect(component.isLoading).toBeFalse();
    }));
    it('should handle custom error and display it on Html if no response found', fakeAsync(() => {
      mockUsersService.addUser.and.returnValue(throwError(() => new Error()));
      component.form.patchValue(mockUser);
      component.save();
      tick();
      expect(component.errorMessage).toBe('Failed to create task');
      expect(component.isLoading).toBeFalse();
    }));
    it('should assign avatar based on name', () => {
      component.form.patchValue({...mockUser,name:'Sad',avatar:''});
      component.save();
      expect(mockUsersService.addUser.calls.mostRecent().args[0].avatar).toBe('SA');
    })

  })

});
