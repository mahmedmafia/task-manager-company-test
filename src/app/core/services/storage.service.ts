import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_PREFIX = 'task_manager_';

interface CachedItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage: Storage | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      this.storage = localStorage;
    }
  }

  private key(name: string): string {
    return `${STORAGE_PREFIX}${name}`;
  }


  getCached<T>(cacheKey: string): T | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(this.key(cacheKey));
      if (!raw) return null;
      const item: CachedItem<T> = JSON.parse(raw);
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(cacheKey);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }


  setCached<T>(cacheKey: string, value: T, ttlMs?: number): void {
    if (!this.storage) return;
    try {
      const item: CachedItem<T> = {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : 0,
      };
      this.storage.setItem(this.key(cacheKey), JSON.stringify(item));
    } catch (e) {
      console.warn('[StorageService] setCached failed', e);
    }
  }



  remove(cacheKey: string): void {
    this.storage?.removeItem(this.key(cacheKey));
  }

  clearAll(): void {
    if (!this.storage) return;
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const k = this.storage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    keys.forEach(k => this.storage!.removeItem(k));
  }
}
