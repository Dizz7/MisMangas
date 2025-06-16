import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
  standalone: false
})
export class ForgotPage {

  user: string = '';
  password: string = '';
  password2: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private authService: AuthService
  ) { }

// Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");

  }

  // Navegar a la página de inicio
  async goHome() {
    this.router.navigate(['/login']);
  
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
  
    async mostrarToast(mensaje: string) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }


  // Método para recuperar contraseña
  async recuperar() {
    if (!this.user || !this.password || !this.password2) {
      return this.mostrarToast('Complete todos los campos');
    }
  
    if (this.password !== this.password2) {
      return this.mostrarToast('Las contraseñas no coinciden');
    }
  
    const existe: boolean = !!(await this.authService.verificarUsuario(this.user));
    if (!existe) {
      return this.mostrarToast('Usuario no existe');
    }
  
    const actualizado = await this.authService.actualizarContrasena(this.user, this.password);
    if (actualizado) {
      // Actualizar localStorage si existe perfil guardado
      const perfilGuardado = localStorage.getItem('perfil');
      if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
        if (perfil.user === this.user) {
          perfil.password = this.password;
          localStorage.setItem('perfil', JSON.stringify(perfil));
        }
      }
  
      await this.mostrarInfo('Contraseña actualizada con éxito');
      this.router.navigate(['/login']);
    } else {
      this.mostrarToast('Error al actualizar');
    }
  }

}


 



