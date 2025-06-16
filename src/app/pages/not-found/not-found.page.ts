import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: false,
})
export class NotFoundPage implements OnInit {

  constructor(

    private router: Router,
    private menuCtrl: MenuController,
  ) { }

    // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");

  }
  
    // Navegar a la página de inicio
    async goHome() {
      this.router.navigate(['/login']);
  } 


}



