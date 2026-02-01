import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  readonly isCollapsed = signal(false);
  readonly isMobileOpen = signal(false);

  toggleCollapsed(): void {
    this.isCollapsed.update(v => !v);
  }

  toggleMobile(): void {
    this.isMobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }
}
