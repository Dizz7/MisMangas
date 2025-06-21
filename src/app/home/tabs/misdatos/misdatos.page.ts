import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
  standalone: false,
})
export class MisdatosPage implements OnInit {

  user: string = '';
  nombre: string = '';
  apellido: string = '';
  educacion: string = '';
  nacimiento: Date | null = null;
  email: string = '';
  password: string = '';
  imagenPerfil: string | null = null;

  nivelesEducacion: string[] = [
    'Básica',
    'Media',
    'Pregrado',
    'Postgrado',
    'Doctorado'
  ];

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

  // Cerrar Menú al navegar y obtener datos del estado de navegación
  async ngOnInit() {
    this.menuCtrl.close("main-menu");
  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
  
    this.imagenPerfil = localStorage.getItem('imagenPerfil');
  
    if (state) {
      if (state['usuario_data']) {
        const datos = state['usuario_data'];
        this.user = datos.user || '';
        this.password = datos.password || '';
        this.nombre = datos.nombre || '';
        this.apellido = datos.apellido || '';
        this.email = datos.email || '';
        this.nacimiento = datos.nacimiento ? new Date(datos.nacimiento) : null;
        this.educacion = datos.educacion || '';
  
        // Actualiza localStorage con el objeto completo
        localStorage.setItem('usuario_data', JSON.stringify(datos));
  
      } else {
        // Si no viene usuario_data, entonces leer propiedades sueltas
        this.user = state['user'] || '';
        this.password = state['password'] || '';
        this.nombre = state['nombre'] || '';
        this.apellido = state['apellido'] || '';
        this.email = state['email'] || '';
        this.nacimiento = state['nacimiento'] ? new Date(state['nacimiento']) : null;
        this.educacion = state['educacion'] || '';
  
        localStorage.setItem('usuario_data', JSON.stringify({
          user: this.user,
          password: this.password,
          nombre: this.nombre,
          apellido: this.apellido,
          email: this.email,
          nacimiento: this.nacimiento,
          educacion: this.educacion
        }));
      }
    } else {
      const guardado = localStorage.getItem('usuario_data');
      if (guardado) {
        const datos = JSON.parse(guardado);
  
        if (datos.user != null) this.user = datos.user;
        if (datos.password != null) this.password = datos.password;
        if (datos.nombre != null) this.nombre = datos.nombre;
        if (datos.apellido != null) this.apellido = datos.apellido;
        if (datos.email != null) this.email = datos.email;
        if (datos.nacimiento != null) this.nacimiento = new Date(datos.nacimiento);
        if (datos.educacion != null) this.educacion = datos.educacion;

        // Imagen de perfil
        const imagenLocal = localStorage.getItem('imagenPerfil');
        if (imagenLocal) {
          this.imagenPerfil = imagenLocal;
        } else if (this.user) {
          // Si no hay imagen en localStorage, intentamos cargar desde base de datos
          const imagenDB = await this.authService.obtenerFotoPerfil(this.user);
          if (imagenDB) {
            this.imagenPerfil = imagenDB;
            localStorage.setItem('imagenPerfil', imagenDB); // la guardamos localmente para la próxima
            }
          }
    
      }
    }
  }

  // Método LIMPIAR con animación
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
  cerrarSesion() {
    localStorage.removeItem('usuario_data');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('session');
    localStorage.removeItem('usuario');
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
  
    // Validar nombre y apellido
    if (!this.nombre) {
      await this.mostrarInfo('Ingrese su nombre.');
      return;
    }
    if (!this.apellido) {
      await this.mostrarInfo('Ingrese su apellido.');
      return;
    }
  
    // Validar correo
    if (!this.email) {
      await this.mostrarInfo('Ingrese un correo electrónico.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      await this.mostrarInfo('El correo electrónico ingresado no es válido.');
      return;
    }
  
    // Validar password
    if (!this.password) {
      await this.mostrarInfo('Ingrese la contraseña.');
      return;
    }
    if (this.password.length !== 4) {
      await this.mostrarInfo('La contraseña debe tener exactamente 4 dígitos.');
      return;
    }
    if (!/^\d+$/.test(this.password)) {
      await this.mostrarInfo('La contraseña sólo puede contener dígitos.');
      return;
    }
  
    // Validar nivel de educación
    if (!this.educacion) {
      await this.mostrarInfo('Seleccione un nivel de educación.');
      return;
    }
  
    // Validar fecha de nacimiento
    if (!this.nacimiento) {
      await this.mostrarInfo('Ingrese su fecha de nacimiento.');
      return;
    }
  
    // Si pasa todas las validaciones:
    const perfil = {
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      nacimiento: this.nacimiento,
      educacion: this.educacion
    };
  
    // Guardar en localStorage
    localStorage.setItem('usuario_data', JSON.stringify({ user: this.user, ...perfil }));
  
    // Actualizar en base de datos
    const actualizado = await this.authService.actualizarPerfil(this.user, perfil);
  
    if (actualizado) {
      await this.mostrarInfo('Datos guardados correctamente.');
    } else {
      await this.mostrarInfo('Error al guardar datos en la base.');
    }   
  }

  // Método para cambiar foto de perfil
  cambiarFoto() {
    this.router.navigate(['/camara'], {
      state: { user: this.user }
    });
  }


// Carga de datos cada vez que entre a la tab
  ionViewWillEnter() {
    const guardado = localStorage.getItem('usuario_data');
    if (guardado) {
      const datos = JSON.parse(guardado);

      if (datos.user != null) this.user = datos.user;
      if (datos.password != null) this.password = datos.password;
      if (datos.nombre != null) this.nombre = datos.nombre;
      if (datos.apellido != null) this.apellido = datos.apellido;
      if (datos.email != null) this.email = datos.email;
      if (datos.nacimiento != null) this.nacimiento = new Date(datos.nacimiento);
      if (datos.educacion != null) this.educacion = datos.educacion;
      if (datos.fotoPerfil != null) this.imagenPerfil = datos.fotoPerfil;
    }
  }
}