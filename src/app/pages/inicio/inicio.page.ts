import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage {

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
  )  { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string };
  }

  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

}
