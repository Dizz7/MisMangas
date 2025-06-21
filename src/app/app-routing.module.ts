import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard]
  },

  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule),
    
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'leyendo',
    loadChildren: () => import('./pages/tabs/leyendo/leyendo.module').then( m => m.LeyendoPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'por-leer',
    loadChildren: () => import('./pages/tabs/por-leer/por-leer.module').then( m => m.PorLeerPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'leidos',
    loadChildren: () => import('./pages/tabs/leidos/leidos.module').then( m => m.LeidosPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule)
  },

  {
    path: 'prueba-api',
    loadChildren: () => import('./pages/prueba-api/prueba-api.module').then( m => m.PruebaApiPageModule)
  },
  {
    path: 'prueba-mangas',
    loadChildren: () => import('./pages/prueba-mangas/prueba-mangas.module').then( m => m.PruebaMangasPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'camara',
    loadChildren: () => import('./pages/camara/camara.module').then( m => m.CamaraPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
