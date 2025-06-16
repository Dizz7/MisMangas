import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService,
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
      const guardado = localStorage.getItem('usuario_data');
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

    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }


  // Mostrar información con alert
  async mostrarInfo(mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'alert-custom',
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
    if (!this.password || !this.password2) {
      await this.mostrarInfo('Complete ambos campos de contraseña');
      return;
    }

    if (this.password.length !== 4 || !/^\d+$/.test(this.password)) {
      await this.mostrarInfo('La contraseña debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    if (this.password !== this.password2) {
      await this.mostrarInfo('Las contraseñas no coinciden');
      return;
    }

    // Suponemos que this.user contiene el usuario logueado
    const actualizado = await this.authService.actualizarContrasena(this.user, this.password);

    if (actualizado) {
      await this.mostrarInfo('Contraseña actualizada correctamente.');
      await this.router.navigate(['/home']);
    } else {
      await this.mostrarInfo('Error al actualizar la contraseña.');
    }
  }
}
