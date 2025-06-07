import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,

    children: [
      {
        path: '',
        redirectTo: 'leyendo',
        pathMatch: 'full',
      },
      {
        path: 'leyendo',
        loadChildren: () => import('./leyendo/leyendo.module').then( m => m.LeyendoPageModule)
      },
      {
        path: 'leidos',
        loadChildren: () => import('./leidos/leidos.module').then( m => m.LeidosPageModule)
      },
      {
        path: 'por-leer',
        loadChildren: () => import('./por-leer/por-leer.module').then( m => m.PorLeerPageModule)
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
