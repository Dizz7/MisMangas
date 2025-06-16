import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: false,
})
export class CertificacionesComponent  implements OnInit {

  user: string = '';
  nombre: string = '';
  apellido: string = '';
  educacion: string = '';
  nacimiento: Date | null = null;
  email: string = '';
  password: string = '';

  nivelesEducacion: string[] = ['Básica', 'Media', 'Pregrado', 'Postgrado', 'Doctorado'];

  @ViewChild('nombreField', { static: false }) nombreField!: ElementRef;
  @ViewChild('apellidoField', { static: false }) apellidoField!: ElementRef;
  @ViewChild('emailField', { static: false }) emailField!: ElementRef;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.menuCtrl.close("main-menu");

    const perfil = localStorage.getItem('perfil');
    if (perfil) {
      const datos = JSON.parse(perfil);
      this.user = datos.user || '';
      this.password = datos.password || '';
      this.nombre = datos.nombre || '';
      this.apellido = datos.apellido || '';
      this.email = datos.email || '';
      this.nacimiento = datos.nacimiento ? new Date(datos.nacimiento) : null;
      this.educacion = datos.educacion || '';
    }
  }

  async mostrarInfo(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'alert-custom',
      header: 'Usuario',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async guardar() {
    if (!this.user) {
      return this.mostrarInfo('Ingrese un usuario.');
    }
    if (this.user.length < 3 || this.user.length > 8) {
      return this.mostrarInfo('El usuario debe tener entre 3 y 8 caracteres.');
    }
    if (!/^[a-zA-Z0-9]{3,8}$/.test(this.user)) {
      return this.mostrarInfo('El usuario ingresado no es válido. Debe ser alfanumérico.');
    }
    if (!this.nombre) {
      return this.mostrarInfo('Ingrese su nombre.');
    }
    if (!this.apellido) {
      return this.mostrarInfo('Ingrese su apellido.');
    }
    if (!this.email) {
      return this.mostrarInfo('Ingrese un correo electrónico.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      return this.mostrarInfo('El correo electrónico ingresado no es válido.');
    }
    if (!this.password) {
      return this.mostrarInfo('Ingrese la contraseña.');
    }
    if (this.password.length !== 4) {
      return this.mostrarInfo('La contraseña debe tener exactamente 4 dígitos.');
    }
    if (!/^\d+$/.test(this.password)) {
      return this.mostrarInfo('La contraseña sólo puede contener dígitos.');
    }
    if (!this.educacion) {
      return this.mostrarInfo('Seleccione un nivel de educación.');
    }
    if (!this.nacimiento) {
      return this.mostrarInfo('Ingrese su fecha de nacimiento.');
    }

    const perfil = {
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      nacimiento: this.nacimiento,
      educacion: this.educacion
    };

    localStorage.setItem('perfil', JSON.stringify({ user: this.user, ...perfil }));

    const actualizado = await this.authService.actualizarPerfil(this.user, perfil);

    if (actualizado) {
      await this.mostrarInfo('Datos guardados correctamente.');
    } else {
      await this.mostrarInfo('Error al guardar datos en la base.');
    }
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.educacion = '';
    this.nacimiento = null;
    this.email = '';
    this.animarCampo(this.nombreField);
    this.animarCampo(this.apellidoField);
    this.animarCampo(this.emailField);
  }

  animarCampo(elementRef: ElementRef) {
    const anim = this.animationCtrl
      .create()
      .addElement(elementRef.nativeElement)
      .duration(1000)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.25, transform: 'translateX(15px)' },
        { offset: 0.5, transform: 'translateX(-15px)' },
        { offset: 0.75, transform: 'translateX(10px)' },
        { offset: 1, transform: 'translateX(0)' }
      ]);
    anim.play();
  }

  cerrarSesion() {
    localStorage.removeItem('perfil');
    this.router.navigate(['/login']);
  }
}


