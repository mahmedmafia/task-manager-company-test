import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AvatarProfileComponent } from "../../../components/avatar-profile/avatar-profile.component";
import { debounceTime } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AvatarProfileComponent, OverlayPanelModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  taskServ = inject(TasksService);
  auth = inject(AuthService);
  searchValue = signal<string | null>('');
  userInitials = computed(() => {
    const user = this.auth.getUser() ?? { name: '', email: '' };
    return user.name?.split(' ').map(s => s[0]).join(' ').toUpperCase() || user.email.slice(0, 2).toUpperCase() || 'U';
  });

  constructor() {
    toObservable(this.searchValue)
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.taskServ.taskSearch.set(res);
      });
  }

  logout(): void {
    this.auth.logout();
  }
}
