import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('StorageService', () => {
  let mockStorage: jasmine.SpyObj<Storage>;
  let store: Record<string, string>;
  let service: StorageService;
  beforeEach(() => {
    store = {};
    mockStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'key'], { length: 0 });
    mockStorage.getItem.and.callFake((key: string) => store[key] ?? null);
    mockStorage.setItem.and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    mockStorage.removeItem.and.callFake((key: string) => {
      delete store[key];
    });
    Object.defineProperty(mockStorage, 'length', {
      get: () => Object.keys(store).length,
    });

    mockStorage.key.and.callFake((index: number) => Object.keys(store)[index] ?? null);

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ],
    });

    // console.log("🚀 ~ mockStorage:", mockStorage)
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get cached value', () => {
    service.setCached('a', '1');
    const val = service.getCached('a');
    expect(val).toBe('1');
  });

  it('should return null if item expired', fakeAsync(() => {
    service.setCached('a', '1', 50);
    tick(60)
    const val = service.getCached('key');
    expect(val).toBeNull();
  }));

  it('should return null if item not found', () => {
    expect(service.getCached('nonExisting')).toBeNull();
  });

  it('should remove cached item', () => {
    service.setCached('a', '1');
    service.remove('a');
    expect(service.getCached('a')).toBeNull();
  });

  it('should clear all  items', () => {
    service.setCached('a', '1');
    service.setCached('b', '2');
    store['other'] = 'x';
    service.clearAll();
    expect(service.getCached('a')).toBeNull();
    expect(service.getCached('b')).toBeNull();
  });
});
