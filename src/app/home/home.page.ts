import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  
  usuarioData: any = null;          // Datos básicos
  experienciaData: any = null;      // Experiencia
  certificacionData: any = null;    // Certificaciones

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.menuCtrl.close("main-menu");

    // Obtener usuario de localStorage
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return;

    // Obtener datos básicos (misdatos)
    const usuarioData = JSON.parse(localStorage.getItem('usuario_data') || '{}');
    this.usuarioData = usuarioData;

    // Obtener experiencia y certificaciones desde la base (Async)
    this.experienciaData = await this.authService.obtenerExperiencia(usuario);
    this.certificacionData = await this.authService.obtenerCertificacion(usuario);

    console.log('Datos completos usuario:', {
      usuarioData: this.usuarioData,
      experiencia: this.experienciaData,
      certificaciones: this.certificacionData,
    });
  }
}