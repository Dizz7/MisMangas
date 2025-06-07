import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PorLeerPage } from './por-leer.page';

const routes: Routes = [
  {
    path: '',
    component: PorLeerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PorLeerPageRoutingModule {}
