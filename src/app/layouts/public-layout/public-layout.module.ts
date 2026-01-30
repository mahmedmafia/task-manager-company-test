import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    pathMatch:'full'
    // children: [
    //   { path: 'login', loadComponent: () => import('../../pages/login/login.page') },
    //   { path: 'signup', loadComponent: () => import('../../pages/signup/signup.page') }
    // ]
  }
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PublicLayoutComponent

  ]
})
export class PublicLayoutModule { }
