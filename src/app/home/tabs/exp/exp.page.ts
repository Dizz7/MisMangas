import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';  

@Component({
  selector: 'app-exp',
  templateUrl: './exp.page.html',
  styleUrls: ['./exp.page.scss'],
  standalone: false
})
export class ExpPage {

  user: string = '';  
  empresa: string = '';
  trabaja_actualmente: boolean = false;
  anio_inicio: number | null = null;
  anio_termino: number | null = null;
  cargo: string = '';

  constructor(private alertController: AlertController,
              private authService: AuthService) {}  

  ionViewWillEnter() {
    // Cargar usuario desde localStorage
    const userStr = localStorage.getItem('usuario');  
    if (userStr) {
      this.user = userStr;
    }
  
    // Cargar experiencia del usuario
    this.cargarExperiencia();
  }

  async cargarExperiencia() {
    if (!this.user) return;
    const exp = await this.authService.obtenerExperiencia(this.user);
    if (exp) {
      this.empresa = exp.empresa || '';
      this.trabaja_actualmente = exp.trabaja_actualmente || false;
      this.anio_inicio = exp.anio_inicio || null;
      this.anio_termino = exp.anio_termino || null;
      this.cargo = exp.cargo || '';
    }
  }

  async mostrarInfo(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Experiencia',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async validarYGuardar() {
    if (!this.empresa) {
      await this.mostrarInfo('Ingrese el nombre de la empresa.');
      return;
    }

    if (!this.cargo) {
      await this.mostrarInfo('Ingrese el cargo desempeñado.');
      return;
    }

    if (!this.anio_inicio) {
      await this.mostrarInfo('Ingrese el año de inicio.');
      return;
    }

    if (!this.trabaja_actualmente && !this.anio_termino) {
      await this.mostrarInfo('Ingrese el año de término o marque que trabaja actualmente.');
      return;
    }

    if (!this.trabaja_actualmente && this.anio_termino != null && this.anio_inicio != null && this.anio_termino < this.anio_inicio) {
      await this.mostrarInfo('El año de término no puede ser menor que el año de inicio.');
      return;
    }

    // Guardar en base de datos
    try {
      const experiencia = {
        empresa: this.empresa,
        trabaja_actualmente: this.trabaja_actualmente ? 1 : 0,  // SQLite usa INTEGER para booleanos
        anio_inicio: this.anio_inicio,
        anio_termino: this.anio_termino,
        cargo: this.cargo
      };

      const success = await this.authService.actualizarExperiencia(this.user, experiencia);

      if (success) {
        await this.mostrarInfo('Datos de experiencia guardados correctamente en la base de datos.');
        
        localStorage.setItem('exp_data', JSON.stringify(experiencia));
      } else {
        await this.mostrarInfo('Error al guardar datos en la base de datos.');
      }
    } catch (error) {
      await this.mostrarInfo('Error inesperado: ' + error);
    }
  }
}