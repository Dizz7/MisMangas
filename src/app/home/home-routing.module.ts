import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';



const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'misdatos',
        pathMatch: 'full'
      },
      {
        path: 'misdatos',
        loadChildren: () => import('./tabs/misdatos/misdatos.module').then(m => m.MisdatosPageModule)
      },
      //{
        //path: 'experiencia',
        //loadChildren: () => import('./tabs/experiencia/experiencia.module').then(m => m.ExperienciaPageModule)
      //},
      //{
        //path: 'certificaciones',
        //loadChildren: () => import('./tabs/certificaciones/certificaciones.module').then(m => m.CertificacionesPageModule)
      //},
      {
        path: 'hola',
        loadChildren: () => import('./tabs/hola/hola.module').then(m => m.HolaPageModule)
      },


    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
