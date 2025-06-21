import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.page.html',
  styleUrls: ['./certificaciones.page.scss'],
  standalone: false,
})
export class CertificacionesPage implements OnInit {

  user: string = '';
  nombre_certificado: string = '';
  fecha_obtencion: string = '';
  certificado_vencimiento: boolean = false;
  fecha_vencimiento: string = '';


  @ViewChild('nombreField', { static: false }) nombreField!: ElementRef;
  @ViewChild('apellidoField', { static: false }) apellidoField!: ElementRef;
  @ViewChild('emailField', { static: false }) emailField!: ElementRef;
  @ViewChild('fotoPerfil', { static: true }) fotoPerfil!: ElementRef;
  @ViewChild('usuarioTexto', { static: true }) usuarioTexto!: ElementRef;


  constructor(
    private router: Router,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {
  }

  ngAfterViewInit() {
    // Animación de la foto de perfil
    const animation = this.animationCtrl.create()
      .addElement(this.fotoPerfil.nativeElement)
      .duration(2500)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'scale(0.9)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1.3)', opacity: '1' },
        { offset: 1, transform: 'scale(0.9)', opacity: '1' }
      ]);

    animation.play();
    

      // Animación para el texto de usuario
    const animTexto = this.animationCtrl.create()
      .addElement(this.usuarioTexto.nativeElement)
      .duration(3000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'translateX(-10px)', opacity: '1' },
        { offset: 0.5, transform: 'translateX(10px)', opacity: '1' },
        { offset: 1, transform: 'translateX(-10px)', opacity: '1' }
      ]);
    animTexto.play();
  }

  // Cerrar Menú al navegar
  ngOnInit() {
    this.menuCtrl.close("main-menu");

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;

    if (state) {
      this.user = state['user'] || '';
      localStorage.setItem('usuario_data', JSON.stringify({
        user: this.user,
      }));
    } else {
      const guardado = localStorage.getItem('usuario_data');
      if (guardado) {
        const datos = JSON.parse(guardado);
        this.user = datos.user || '';
      }
    }


    // Intentar cargar las certificaciones desde la base de datos
    if (this.user) {
      this.authService.obtenerCertificacion(this.user).then(certificaciones => {
        if (certificaciones.length > 0) {
          const cert = certificaciones[0];
          this.nombre_certificado = cert.nombre_certificado || '';
          this.fecha_obtencion = cert.fecha_obtencion || '';
          this.certificado_vencimiento = cert.certificado_vencimiento === 1 || cert.certificado_vencimiento === true;
          this.fecha_vencimiento = cert.fecha_vencimiento || '';
          
        }
      }).catch(() => {
        // En caso de error, no hacer nada
      });
    }
  }

  // Método LIMPIAR con animación
  limpiar() {
    this.nombre_certificado = '';
    this.fecha_obtencion = '';
    this.certificado_vencimiento = false;
    this.fecha_vencimiento = '';
  
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

  // Método MOSTRAR
  async mostrar() {
    // No longer applicable for removed fields, can be left empty or removed
  }
  cerrarSesion() {
    localStorage.removeItem('usuario_data');
    this.router.navigate(['/login']);
  }

  // Método para Guardar datos en base de datos y localstorage
  async guardar() {
    // Validar usuario
    if (!this.user) {
      await this.mostrarInfo('Ingrese un usuario.');
      return;
    }
  
    // Validar nombre certificado
    if (!this.nombre_certificado) {
      await this.mostrarInfo('Ingrese el nombre del certificado.');
      return;
    }
  
    // Validar fecha de obtención
    if (!this.fecha_obtencion) {
      await this.mostrarInfo('Ingrese la fecha de obtención del certificado.');
      return;
    }
  
    // Validar fecha de vencimiento si aplica
    if (this.certificado_vencimiento && !this.fecha_vencimiento) {
      await this.mostrarInfo('Ingrese la fecha de vencimiento del certificado.');
      return;
    }
  
    // Si pasa todas las validaciones:
    const certificacion = {
      nombre_certificado: this.nombre_certificado,
      fecha_obtencion: this.fecha_obtencion,
      certificado_vencimiento: this.certificado_vencimiento,
      fecha_vencimiento: this.fecha_vencimiento
    };
  
    // Guardar en localStorage bajo 'usuario_data' manteniendo el objeto completo
    let usuarioDataRaw = localStorage.getItem('usuario_data');
    let usuarioData: any;
    try {
      usuarioData = usuarioDataRaw ? JSON.parse(usuarioDataRaw) : {};
    } catch (e) {
      usuarioData = {};
    }
    // Asegurarse de mantener el campo user
    if (!usuarioData.user) {
      usuarioData.user = this.user;
    }
    usuarioData.nombre_certificado = this.nombre_certificado;
    usuarioData.fecha_obtencion = this.fecha_obtencion;
    usuarioData.certificado_vencimiento = this.certificado_vencimiento;
    usuarioData.fecha_vencimiento = this.fecha_vencimiento;
    localStorage.setItem('usuario_data', JSON.stringify(usuarioData));
    
 
    // Guardar en base de datos
    const agregado = await this.authService.agregarCertificacion(this.user, certificacion);
  
    if (agregado) {
      await this.mostrarInfo('Certificación guardada correctamente.');
    } else {
      await this.mostrarInfo('Error al guardar la certificación en la base.');
    }   
  }

}
