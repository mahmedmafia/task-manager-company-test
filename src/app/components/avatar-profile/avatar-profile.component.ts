import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-profile.component.html',
  styleUrl: './avatar-profile.component.scss'
})
export class AvatarProfileComponent {
  @Input() initials: string = '';
  @Input() size: 'md' |'sm' | 'lg' = 'lg';
  @Input()
  set name(value: string) {
    this.initials = value.split(' ').map(s => s[0]).join('').toUpperCase() || value.slice(0, 2).toUpperCase() || '';
  }
}
