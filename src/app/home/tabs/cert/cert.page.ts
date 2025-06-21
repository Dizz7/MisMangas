import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ViewWillEnter, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cert',
  templateUrl: './cert.page.html',
  styleUrls: ['./cert.page.scss'],
  standalone: false
})
export class CertPage implements ViewWillEnter {

  user: string = '';
  nombre_certificado: string = '';
  fecha_obtencion: string = '';
  certificado_vencimiento: boolean = false;
  fecha_vencimiento: string = '';

  constructor(private authService: AuthService, private alertController: AlertController) { }

  async ionViewWillEnter() {
    this.user = localStorage.getItem('usuario') || '';

    if (this.user) {
      const cert = await this.authService.obtenerCertificacion(this.user);
      if (cert) {
        this.nombre_certificado = cert.nombre_certificado || '';
        this.fecha_obtencion = cert.fecha_obtencion || '';
        this.certificado_vencimiento = cert.certificado_vencimiento || false;
        this.fecha_vencimiento = cert.fecha_vencimiento || '';
      } else {
        // Si no hay datos, limpiar formulario
        this.nombre_certificado = '';
        this.fecha_obtencion = '';
        this.certificado_vencimiento = false;
        this.fecha_vencimiento = '';
      }
    }
  }

  async guardar() {
    if (!this.user) return;

    const certificacion = {
      nombre_certificado: this.nombre_certificado,
      fecha_obtencion: this.fecha_obtencion,
      certificado_vencimiento: this.certificado_vencimiento ? 1 : 0,
      fecha_vencimiento: this.fecha_vencimiento
    };

    const resultado = await this.authService.agregarCertificacion(this.user, certificacion);
    if (resultado) {
      await this.mostrarInfo('Certificación guardada correctamente');
    } else {
      await this.mostrarInfo('Error al guardar la certificación');
    }
  }

  async mostrarInfo(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Certificación',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}