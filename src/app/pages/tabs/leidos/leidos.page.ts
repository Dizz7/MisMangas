import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-leidos',
  templateUrl: './leidos.page.html',
  styleUrls: ['./leidos.page.scss'],
  standalone: false
})
export class LeidosPage implements OnInit {

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
  ) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string };
  }

  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

}