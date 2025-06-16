import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


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
    private authService: AuthService
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
      await this.mostrarError('Ingrese un usuario.');
      return;
    }
  
    if (this.user.length < 3 || this.user.length > 8) {
      await this.mostrarError('El usuario debe tener entre 3 y 8 caracteres.');
      return;
    }
  
    if (!this.validarUsuario(this.user)) {
      await this.mostrarError('El usuario ingresado no es válido. Debe ser alfanumérico.');
      return;
    }
  
    if (!this.nombre) {
      await this.mostrarError('Ingrese su nombre.');
      return;
    }
  
    if (!this.apellido) {
      await this.mostrarError('Ingrese su apellido.');
      return;
    }
  
    if (!this.email) {
      await this.mostrarError('Ingrese su correo.');
      return;
    }
  
    if (!this.validarCorreo(this.email)) {
      await this.mostrarError('El correo electrónico ingresado no es válido.');
      return;
    }
  
    if (!this.nacimiento) {
      await this.mostrarError('Ingrese su fecha de nacimiento.');
      return;
    }
  
    if (this.nacimiento > new Date()) {
      await this.mostrarError('La fecha de nacimiento no puede ser futura.');
      return;
    }
  
    if (!this.educacion || this.educacion === 'Seleccione') {
      await this.mostrarError('Seleccione un nivel de educación válido.');
      return;
    }
  
    if (!this.password) {
      await this.mostrarError('Ingrese la contraseña.');
      return;
    }
  
    if (this.password.length !== 4) {
      await this.mostrarError('La contraseña debe tener exactamente 4 dígitos.');
      return;
    }
  
    if (!/^\d+$/.test(this.password)) {
      await this.mostrarError('La contraseña sólo puede contener dígitos.');
      return;
    }
  
    if (!this.password2) {
      await this.mostrarError('Confirme la contraseña.');
      return;
    }
  
    if (this.password !== this.password2) {
      await this.mostrarError('Las contraseñas no coinciden.');
      return;
    }
  
    await this.mostrarToasts();
  
    try {
      await this.authService.registerUser(
        this.user,
        this.nombre,
        this.apellido,
        this.email,
        this.password,
        this.educacion,
        this.nacimiento.toISOString().split('T')[0] // Convertir a formato YYYY-MM-DD
      );
  
      localStorage.setItem('usuario_data', JSON.stringify({
        user: this.user,
        password: this.password,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        educacion: this.educacion,
        nacimiento: this.nacimiento.toISOString().split('T')[0]
      
      }));
  
      this.router.navigate(['/login'], {
        state: {
          user: this.user,
          password: this.password,
          nombre: this.nombre,
          apellido: this.apellido,
          email: this.email,  
          educacion: this.educacion,
          nacimiento: this.nacimiento.toISOString().split('T')[0]
        
        }
      });
  
    } catch (error) {
      await this.mostrarError('Error al registrar el usuario. Intenta nuevamente.');
      console.error(error);
    }
  }
}