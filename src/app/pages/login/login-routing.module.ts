import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),   MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
