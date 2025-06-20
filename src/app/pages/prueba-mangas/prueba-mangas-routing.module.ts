import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PruebaMangasPage } from './prueba-mangas.page';

const routes: Routes = [
  {
    path: '',
    component: PruebaMangasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PruebaMangasPageRoutingModule {}
