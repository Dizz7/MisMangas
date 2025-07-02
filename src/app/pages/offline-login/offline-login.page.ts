import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './offline-login.page.html',
  styleUrls: ['./offline-login.page.scss'],
  standalone: false
})
export class LoginPage {

  user: string = '';
  password: string = '';
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

    // Agregar usuario de ejemplo para pruebas unitarias
  const usuarioGuardado = localStorage.getItem('usuario_data');
  if (!usuarioGuardado) {
    const usuarioEjemplo = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      nacimiento: '1990-01-01',
      educacion: 'Universitaria',
      user: 'prueba',
      password: '1234'
    };
    localStorage.setItem('usuario_data', JSON.stringify(usuarioEjemplo));
  }
  }

  // Mostrar toast de inicio de sesión
  async mostrarToasts() {
    const toast = await this.toastController.create({
      message: 'Inicio de Sesión Exitoso.',
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


    



    /*// Verificar usuario y contraseña en la base de datos usando AuthService
    const esValido = await this.authService.loginUsuario(this.user, this.password);
    if (!esValido) {
      this.mostrarError('Usuario o contraseña incorrectos.');
      return;
    }*/

    // Obtener datos del perfil para continuar (si existen)
    const guardado = localStorage.getItem('usuario_data');
    if (!guardado) {
      this.mostrarError('No se pudieron recuperar los datos del usuario.');
      return;
    }
    const datos = JSON.parse(guardado);

    // Si todo es correcto
    await this.mostrarToasts();
    this.router.navigateByUrl('/login', {
      state: {
        user: this.user,
        password: this.password,
        nombre: datos?.nombre,
        apellido: datos?.apellido,
        email: datos?.email,
        nacimiento: datos?.nacimiento,
        educacion: datos?.educacion
      }
    }).then(() => window.location.reload());
}
}
