import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  tarea: string = '';
  mensaje: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private animationCtrl: AnimationController,
    private authService: AuthService
  ) {}

  @ViewChild('fotoLogo', { static: true }) fotoLogo!: ElementRef;




  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

  // Mostrar toast de inicio de sesión
  async mostrarToasts() {
    const toast = await this.toastController.create({
      message: 'Iniciando Sesión.',
      duration: 300,
      color: 'success',
    });
    await toast.present();
  }

  // Mostrar errores con alert
  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }


  // Método login con validaciones
  async add() {
    if (!this.tarea) {
      this.mostrarError('Ingrese un usuario.');
      return;
    }

    if (this.tarea.length == 0) {
      this.mostrarError('La tarea no puede estar en blanco.');
      return;
    }
  }
}
