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
  @Input() size: string = 'lg';
}
