import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.scss'],
  standalone: false,
})
export class ExperienciaComponent  implements OnInit {
  user: string = '';
  empresa: string = '';
  trabaja_actualmente: boolean = false;
  anio_inicio: number | null = null;
  anio_termino: number | null = null;
  cargo: string = '';

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
      this.empresa = state['empresa'] || '';
      this.trabaja_actualmente = state['trabaja_actualmente'] || false;
      this.anio_inicio = state['anio_inicio'] || null;
      this.anio_termino = state['anio_termino'] || null;
      this.cargo = state['cargo'] || '';
    } else {
      const guardado = localStorage.getItem('usuario_data');
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (datos.user != null) this.user = datos.user;
        if (datos.empresa != null) this.empresa = datos.empresa;
        if (datos.trabaja_actualmente != null) this.trabaja_actualmente = datos.trabaja_actualmente;
        if (datos.anio_inicio != null) this.anio_inicio = datos.anio_inicio;
        if (datos.anio_termino != null) this.anio_termino = datos.anio_termino;
        if (datos.cargo != null) this.cargo = datos.cargo;
      }
    }

    // Recuperar desde la base de datos si se tiene un usuario válido
    if (this.user) {
      this.authService.obtenerExperiencia(this.user).then((exp) => {
        if (exp) {
          this.empresa = exp.empresa || '';
          this.trabaja_actualmente = exp.trabaja_actualmente || false;
          this.anio_inicio = exp.anio_inicio || null;
          this.anio_termino = exp.anio_termino || null;
          this.cargo = exp.cargo || '';

          // Actualizar también en localStorage
          const actualizado = {
            user: this.user,
            empresa: this.empresa,
            trabaja_actualmente: this.trabaja_actualmente,
            anio_inicio: this.anio_inicio,
            anio_termino: this.anio_termino,
            cargo: this.cargo
          };
          localStorage.setItem('usuario_data', JSON.stringify(actualizado));
        }
      });
    }
  }

  // Método LIMPIAR con animación
  limpiar() {
    this.empresa = '';
    this.trabaja_actualmente = false;
    this.anio_inicio = null;
    this.anio_termino = null;
    this.cargo = '';
  
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
    if (!this.empresa) {
      await this.mostrarInfo('Ingrese el nombre de la empresa.');
      return;
    }
    await this.mostrarInfo(`Empresa: ${this.empresa}`);
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
    if (this.user.length < 3 || this.user.length > 8) {
      await this.mostrarInfo('El usuario debe tener entre 3 y 8 caracteres.');
      return;
    }
    if (!/^[a-zA-Z0-9]{3,8}$/.test(this.user)) {
      await this.mostrarInfo('El usuario ingresado no es válido. Debe ser alfanumérico.');
      return;
    }

    // Validar empresa
    if (!this.empresa) {
      await this.mostrarInfo('Ingrese el nombre de la empresa.');
      return;
    }

    // Validar año de inicio
    if (this.anio_inicio === null || this.anio_inicio <= 1900 || this.anio_inicio > new Date().getFullYear()) {
      await this.mostrarInfo('Ingrese un año de inicio válido.');
      return;
    }

    // Validar año de término si no trabaja actualmente
    if (!this.trabaja_actualmente) {
      if (this.anio_termino === null || this.anio_termino < this.anio_inicio || this.anio_termino > new Date().getFullYear()) {
        await this.mostrarInfo('Ingrese un año de término válido y mayor o igual al año de inicio.');
        return;
      }
    }

    // Validar cargo
    if (!this.cargo) {
      await this.mostrarInfo('Ingrese el cargo desempeñado.');
      return;
    }

    // Si pasa todas las validaciones:
    const experiencia = {
      empresa: this.empresa,
      trabaja_actualmente: this.trabaja_actualmente,
      anio_inicio: this.anio_inicio,
      anio_termino: this.trabaja_actualmente ? null : this.anio_termino,
      cargo: this.cargo
    };

    // Guardar en localStorage
    // Leer datos actuales de usuario_data
    const usuarioDataRaw = localStorage.getItem('usuario_data');
    let usuarioData = usuarioDataRaw ? JSON.parse(usuarioDataRaw) : { user: this.user };

    // Actualizar la experiencia en usuarioData
    usuarioData.empresa = this.empresa;
    usuarioData.trabaja_actualmente = this.trabaja_actualmente;
    usuarioData.anio_inicio = this.anio_inicio;
    usuarioData.anio_termino = this.trabaja_actualmente ? null : this.anio_termino;
    usuarioData.cargo = this.cargo;

    // Guardar el objeto completo actualizado
    localStorage.setItem('usuario_data', JSON.stringify(usuarioData));

    // Actualizar en base de datos
    const actualizado = await this.authService.actualizarExperiencia(this.user, experiencia);

    if (actualizado) {
      await this.mostrarInfo('Datos guardados correctamente.');
    } else {
      await this.mostrarInfo('Error al guardar datos en la base.');
    }   
  }

}