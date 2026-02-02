import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AvatarProfileComponent } from "../../../components/avatar-profile/avatar-profile.component";
import { debounceTime, filter, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarService } from '../../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AvatarProfileComponent, OverlayPanelModule, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit {
  taskServ = inject(TasksService);
  auth = inject(AuthService);
  sidebarService = inject(SidebarService);
  searchValue = signal<string | null>('');
  router = inject(Router);
  userName = computed(() => {
    const user = this.auth.getUser();
    return user?.name || user?.email || '';
  });
  destoryRef = inject(DestroyRef);
  constructor() {
    toObservable(this.searchValue)
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.taskServ.taskSearch.set(res);
      });

  }

  routePrefix = signal('');
  ngOnInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destoryRef), filter(event => event instanceof NavigationEnd),
        map(() => this.router.url),
        map(x => x.split('/').pop()),
        tap(x => this.routePrefix.set(x ?? ''))).subscribe()

  }

  logout(): void {
    this.auth.logout();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleMobile();
  }
}
