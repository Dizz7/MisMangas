import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeyendoPage } from './leyendo.page';

const routes: Routes = [
  {
    path: '',
    component: LeyendoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeyendoPageRoutingModule {}
