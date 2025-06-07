import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeidosPage } from './leidos.page';

const routes: Routes = [
  {
    path: '',
    component: LeidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeidosPageRoutingModule {}
