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

      // Permitir acceso a /registro sin sesión
      if (currentPath === '/registro') {
        // no redirigir, dejar que se cargue
        return;
      }

      // Redirigir a login para otras rutas
      this.router.navigateByUrl('/login');
    }
  }
 // Cerrar sesión y redirigir a login
  cerrarSesion() {
    this.menuCtrl.close('main-menu'); // cierra menú si tienes uno con ese id
    this.authService.logout();        // limpia sesión
    this.router.navigate(['/login']); // redirige a login
  }
}