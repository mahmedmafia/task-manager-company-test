import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from "primeng/confirmdialog";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule,  ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-manager-company-test';
}
