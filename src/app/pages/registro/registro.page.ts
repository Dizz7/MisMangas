import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {

  user: string = '';
  password: string = '';
  password2: string = '';
  mensaje: string = '';
  educacion: string = '';
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  nacimiento: Date | null = null;


  nivelesEducacion: string[] = [
    'Básica',
    'Media',
    'Pregrado',
    'Postgrado',
    'Doctorado'
  ];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private menuCtrl: MenuController,
  ) {}

  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

  // Mostrar toast de inicio de sesión
  async mostrarToasts() {
    const toast = await this.toastController.create({
      message: 'Registrando Datos.',
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

// Validar formato del correo
validarCorreo(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

  // Método register con validaciones
  async register() {
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

    if (!this.user) {
      this.mostrarError('Ingrese un usuario.');
      return;
    }

    if (!this.nombre) {
      this.mostrarError('Ingrese su nombre.');
      return;
    }

    if (!this.apellido) {
      this.mostrarError('Ingrese su apellido.');
      return;
    }

    if (!this.email) {
      this.mostrarError('Ingrese su correo.');
      return;
    }

    if (!this.validarCorreo(this.email)) {
      this.mostrarError('El correo electrónico ingresado no es válido.');
      return;
    }
    if (!this.nacimiento) {
      this.mostrarError('Ingrese su fecha de nacimiento.');
      return;
    }
    if (this.nacimiento > new Date()) {
      this.mostrarError('La fecha de nacimiento no puede ser futura.');
      return;
    }
    if (!this.educacion) {
      this.mostrarError('Seleccione su nivel de educación.');
      return;
    }
    if (this.educacion === 'Seleccione') {
      this.mostrarError('Seleccione un nivel de educación válido.');
      return;
    }

    // Validar contraseña

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
    if (!this.password2) {
      this.mostrarError('Confirme la contraseña.');
      return;
    }
    if (this.password !== this.password2) {
      this.mostrarError('Las contraseñas no coinciden.');
      return;
    }
    // Si todas las validaciones pasan, se puede proceder al registro

    // Si todo es correcto
    await this.mostrarToasts();

    localStorage.setItem('perfil', JSON.stringify({
      user: this.user,
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      nacimiento: this.nacimiento,
      educacion: this.educacion
    }));
    
    this.router.navigate(['/login'], {
      state: {
        user: this.user,
        password: this.password,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        nacimiento: this.nacimiento,
        educacion: this.educacion
      }
    });
  }
}