import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: string = '';
  nombre: string = '';
  apellido: string = '';
  educacion: string = '';
  nacimiento: Date | null = null;

  nivelesEducacion: string[] = [
    'Básica',
    'Media',
    'Pregrado',
    'Postgrado',
    'Doctorado'
  ];

  @ViewChild('nombreField', { static: false }) nombreField!: ElementRef;
  @ViewChild('apellidoField', { static: false }) apellidoField!: ElementRef;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string };

    if (state?.user) {
      this.user = state.user;
    }
  }

  // Método LIMPIAR con animación
  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.educacion = '';
    this.nacimiento = null;
  
    this.animarCampo(this.nombreField);
    this.animarCampo(this.apellidoField);
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

  // Mostrar información con alert
  async mostrarInfo(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Usuario',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método MOSTRAR
  async mostrar() {
    if (!this.nombre && !this.apellido) {
      await this.mostrarInfo('Ingrese su nombre y apellido.');
      return;
    }

    if (!this.nombre) {
      await this.mostrarInfo('Ingrese su nombre.');
      return;
    }

    if (!this.apellido) {
      await this.mostrarInfo('Ingrese su apellido.');
      return;
    }

    await this.mostrarInfo(`Su nombre es ${this.nombre} ${this.apellido}.`);
  }
}