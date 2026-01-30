import { Component } from '@angular/core';
import { AvatarProfileComponent } from "../../../components/avatar-profile/avatar-profile.component";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AvatarProfileComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {

}
