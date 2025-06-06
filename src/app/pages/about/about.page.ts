import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false
})
export class AboutPage {

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
  
  ){
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string };



  }

  
  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }


}
