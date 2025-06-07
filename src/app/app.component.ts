import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';



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
  ) {}

  // Cerrar sesion
  cerrarSesion() {
    this.menuCtrl.close("main-menu");
    this.router.navigate(['/login']);
  }

}


