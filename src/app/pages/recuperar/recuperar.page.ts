import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false
})
export class RecuperarPage {
  user: string = '';
  nombre: string = '';
  apellido: string = '';
  educacion: string = '';
  nacimiento: Date | null = null;
  email: string = '';
  password: string = '';
  password2: string = '';

  nivelesEducacion: string[] = [
    'Básica',
    'Media',
    'Pregrado',
    'Postgrado',
    'Doctorado'
  ];


  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
  ) {
  }

  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;

    if (state) {
      this.user = state['user'] || '';
      this.password = state['password'] || '';
      this.nombre = state['nombre'] || '';
      this.apellido = state['apellido'] || '';
      this.email = state['email'] || '';
      this.nacimiento = state['nacimiento'] ? new Date(state['nacimiento']) : null;
      this.educacion = state['educacion'] || '';

      localStorage.setItem('perfil', JSON.stringify({
        user: this.user,
        password: this.password,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        nacimiento: this.nacimiento,
        educacion: this.educacion
      }));
    } else {
      const guardado = localStorage.getItem('perfil');
      if (guardado) {
        const datos = JSON.parse(guardado);
        this.user = datos.user || '';
        this.password = datos.password || '';
        this.nombre = datos.nombre || '';
        this.apellido = datos.apellido || '';
        this.email = datos.email || '';
        this.nacimiento = datos.nacimiento ? new Date(datos.nacimiento) : null;
        this.educacion = datos.educacion || '';
      }
    }
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


  // Navegar a la página de inicio
  async goHome() {
      this.router.navigate(['/login']);
    } 

  
  
  // Guardar perfil en localStorage
  async recuperar() {
    // Validar campos
    if (!this.user) {
      await this.mostrarInfo('Debe ingresar su nombre de usuario.');
      return;
    }
  
    if (!this.password || !this.password2) {
      await this.mostrarInfo('Debe completar ambos campos de la contraseña.');
      return;
    }

  
    if (this.password.length !== 4 || !/^\d+$/.test(this.password)) {
      await this.mostrarInfo('La contraseña debe tener exactamente 4 dígitos numéricos.');
      return;
    }
  
    if (this.password !== this.password2) {
      await this.mostrarInfo('Las contraseñas no coinciden.');
      return;
    }
  
    // Obtener el perfil desde localStorage
    const perfilGuardado = localStorage.getItem('perfil');
    if (!perfilGuardado) {
      await this.mostrarInfo('No se encontró ningún perfil guardado.');
      return;
    }
  
    const perfil = JSON.parse(perfilGuardado);
  
    // Validar que el usuario coincida
    if (perfil.user !== this.user) {
      await this.mostrarInfo('El usuario ingresado no coincide con el perfil guardado.');
      return;
    }
  
    // Actualizar la contraseña
    perfil.password = this.password;
  
    // Guardar perfil actualizado
    localStorage.setItem('perfil', JSON.stringify(perfil));
  
    await this.mostrarInfo('Contraseña actualizada correctamente.');
    await this.router.navigate(['/login']);
  }
}

