import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  user: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  // Mostrar toast de inicio de sesión
  async mostrarToasts() {
    const toast = await this.toastController.create({
      message: 'Iniciando Sesión.',
      duration: 2000,
      color: 'success'
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


// Validar formato del usuario (sólo letras y números, entre 3 y 8 caracteres)
validarUsuario(user: string): boolean {
  const usuarioRegex = /^[a-zA-Z0-9]{3,8}$/;
  return usuarioRegex.test(user);
}

  // Método login con validaciones
  async login() {
    if (!this.user) {
      this.mostrarError('Ingrese un usuario.');
      return;
    }

    if (this.user.length < 3 || this.user.length > 8) {
      this.mostrarError('El usuario debe tener entre 3 y 8 caracteres.');
      return;
    }

    if (!this.validarUsuario(this.user)) {
      this.mostrarError('El usuario ingresado no es válido. Debe ser alfanumérico.');
      return;
    }

    if (!this.password) {
      this.mostrarError('Ingrese la contraseña.');
      return;
    }



    if (this.password.length !== 4) {
      this.mostrarError('La contraseña debe tener exactamente 4 dígitos.');
      return;
    }

    if (!/^\d+$/.test(this.password)) {
      this.mostrarError('La contraseña sólo puede contener dígitos.');
      return;
    }

    // Si todo es correcto
    await this.mostrarToasts();
    this.router.navigate(['/home'], { state: { user: this.user } });
  }
}