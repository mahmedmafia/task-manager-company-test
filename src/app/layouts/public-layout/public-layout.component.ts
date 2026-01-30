import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
  router=inject(Router);
  ngOnInit(): void {
    this.router.navigate(['/main']);
  }

}
