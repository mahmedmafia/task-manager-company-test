import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SideBarComponent {

}
