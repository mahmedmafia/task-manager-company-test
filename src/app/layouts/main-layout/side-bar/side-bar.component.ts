import { Component } from '@angular/core';
import { RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

}
