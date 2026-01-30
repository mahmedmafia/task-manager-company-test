import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopbarComponent } from "./topbar/topbar.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, TopbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
