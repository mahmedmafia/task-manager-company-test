import { TestBed } from '@angular/core/testing';
import { AuthService, LoginCredentials, AuthUser, LoginResponse } from './auth.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let mockStorage: jasmine.SpyObj<StorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('StorageService', ['getCached', 'setCached', 'remove']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: StorageService, useValue: mockStorage },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken', () => {
    it('should return token from storage if present', () => {
      mockStorage.getCached.and.returnValue('stored-token');
      expect(service.getToken()).toBe('stored-token');
    });

    it('should return token from signal if not in storage', () => {
      service['tokenSignal'].set('signal-token');
      mockStorage.getCached.and.returnValue(null);
      expect(service.getToken()).toBe('signal-token');
    });

    it('should return null if no token', () => {
      service['tokenSignal'].set(null);
      mockStorage.getCached.and.returnValue(null);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user from storage', () => {
      const user: AuthUser = { email: 'test@test.com', name: 'test' };
      mockStorage.getCached.and.returnValue(user);
      expect(service.getUser()).toEqual(user);
    });

    it('should return null if no user', () => {
      mockStorage.getCached.and.returnValue(null);
      expect(service.getUser()).toBeNull();
    });
  });

  describe('login', () => {
    it('should set token and user and return LoginResponse', (done) => {
      const credentials: LoginCredentials = { email: 'john@test.com', password: '1234' };

      service.login(credentials).subscribe((res: LoginResponse) => {
        expect(res.token).toContain('mock-jwt-');
        expect(res.user?.email).toBe(credentials.email);
        expect(service.getToken()).toBe(res.token);
        expect(service.isAuthenticated()).toBeTrue();
        expect(mockStorage.setCached).toHaveBeenCalledWith('auth_token', res.token);
        expect(mockStorage.setCached).toHaveBeenCalledWith('auth_user', res.user);
        done();
      });
    });
  });

  describe('logout', () => {
    it('should clear token, user and navigate to login', () => {
      service['tokenSignal'].set('token');
      service.isAuthenticated.set(true);

      service.logout();

      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(mockStorage.remove).toHaveBeenCalledWith('auth_token');
      expect(mockStorage.remove).toHaveBeenCalledWith('auth_user');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
