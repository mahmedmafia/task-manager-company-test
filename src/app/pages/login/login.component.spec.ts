import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { configureGlobalTestingModule } from '../../../test';

const mockAuthService = {
  isAuthenticated: () => false,
  login: () => of({ token: 'mock-token' }),
};
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServ: AuthService;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  beforeEach(async () => {
    await configureGlobalTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
    router = TestBed.get(Router);
    authServ = TestBed.get(AuthService);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Reactivity', () => {
    it('should call auth Service with form Value', fakeAsync(() => {
      const loginSpy = spyOn(authServ, 'login').and.callThrough();
      const mockFormValue = { email: 't@t.com', password: '1234' };
      component.form.setValue(mockFormValue);
      component.onSubmit();
      expect(loginSpy).toHaveBeenCalledWith(mockFormValue);
    }))
    it('should navigate away after succesfull login', fakeAsync(() => {
      component.form.setValue({ email: 't@t.com', password: '1234' });
      component.onSubmit();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    }));
  })
  describe('Page Render', () => {
    it('should render title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Task Manager');
    });
    it('should display error on short password input', () => {
      component.form.get('password')?.setValue('123');
      component.form.get('password')?.markAsTouched();
      fixture.detectChanges();
      const requiredLength = component.form.get('password')?.errors?.['minlength']?.requiredLength;
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('div.invalid-feedback')?.textContent).toContain(`Password must be at least ${requiredLength} characters.`);
    });
    it('should display error on invalid email input', () => {
      component.form.get('email')?.setValue('invalid-email');
      component.form.get('email')?.markAsTouched();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('div.invalid-feedback')?.textContent).toContain('Enter a valid email address.');
    });
    it('should display button as disabled on form invalid', () => {
      component.form.get('email')?.markAsTouched();
      component.form.get('password')?.markAsTouched();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const submitBtn = compiled.querySelector("button[type='submit']") as HTMLButtonElement;
      expect(submitBtn.disabled).toBe(true);
    });
    it('it should display  error message from response if login failed', fakeAsync(() => {
      spyOn(authServ, 'login').and.returnValue(throwError(() => new Error('Network Error')))
      component.form.setValue({ email: 't@t.com', password: '1234' });
      component.onSubmit();
      tick();
      const compiled = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
      expect(compiled.querySelector('#form-error')?.textContent).toContain('Network Error');
      expect(component.errorMessage).toContain('Network Error');
    }))

    it('it should display custom error if login failed and no error response', fakeAsync(() => {
      spyOn(authServ, 'login').and.returnValue(throwError(() => ''))
      component.form.setValue({ email: 't@t.com', password: '1234' });
      component.onSubmit();
      tick();
      const compiled = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
      expect(compiled.querySelector('#form-error')?.textContent).toContain('Login failed. Please try again.');
      expect(component.errorMessage).toContain('Login failed. Please try again.');
    }))
  })





});
