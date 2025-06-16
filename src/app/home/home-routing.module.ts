import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MisdatosComponent } from '../components/misdatos/misdatos.component';
import { ExperienciaComponent } from '../components/experiencia/experiencia.component';
import { CertificacionesComponent } from '../components/certificaciones/certificaciones.component';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'misdatos',
        component: MisdatosComponent
      },
      {
        path: 'experiencia',
        component: ExperienciaComponent
      },
      {
        path: 'certificaciones',
        component: CertificacionesComponent
      },
      {
        path: '',
        redirectTo: 'misdatos',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
