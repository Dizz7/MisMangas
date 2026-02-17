import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private location: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    } else {
      const currentPath = this.location.path();

      // Permitir acceso a /registro y /forgot sin sesión
      if (currentPath === '/registro' || currentPath === '/forgot') {
        // no redirigir, dejar que se cargue
        return;
      }

      // Redirigir a login para otras rutas
      this.router.navigateByUrl('/tabs');
    }
  }
 // Cerrar sesión y redirigir a login
  async cerrarSesion() {
    this.menuCtrl.close('main-menu'); // cierra menú si tienes uno con ese id
    await this.authService.logout();        // limpia sesión
    await this.authService.cerrarConexion(); // cierra conexión
    this.router.navigate(['/tabs']); // redirige a login
  }
}