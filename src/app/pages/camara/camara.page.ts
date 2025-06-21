import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
  standalone: false
})
export class CamaraPage implements OnInit {


  public photo: string | undefined;

  constructor(    private router: Router, 
                  private menuCtrl: MenuController,
                  private authService: AuthService,
                ) { }

  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64, // puede ser Uri o Base64, aquí usamos Base64 para mostrarla fácil
        source: CameraSource.Camera // Para abrir la cámara (puedes usar Photos para galería)
      });

      this.photo = 'data:image/jpeg;base64,' + image.base64String;


  // Guardar la foto en el sistema de archivos
  const fileName = new Date().getTime() + '.jpeg'; // Nombre único basado en timestamp

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: image.base64String!,
    directory: Directory.Data // Usar Directory.Data para almacenamiento privado
  });

  console.log('Foto guardada en:', savedFile.uri);


    } catch (error) {
      console.error('Error al tomar foto', error);
    }
  }

  async guardarImagen() {
    if (!this.photo) {
      console.warn('No hay foto para guardar');
      return;
    }
  
    // Guardar la imagen en localStorage
    localStorage.setItem('imagenPerfil', this.photo);
  
    // Obtener el usuario actual desde localStorage
    const user = localStorage.getItem('usuario');
    if (!user) {
      console.error('No hay sesión de usuario activa');
      return;
    }
  
    // Guardar en base de datos
    const exito = await this.authService.actualizarFotoPerfil(user, this.photo);
  
    if (exito) {
      console.log('Foto guardada correctamente en la base de datos');
      this.router.navigateByUrl('/misdatos').then(() => {
        window.location.reload(); // para que la vista de perfil se actualice con la nueva foto
      });
    } else {
      console.error('Error al guardar la foto en la base de datos');
    }
  }

  // Volver al Home sin cambios
  volver() {
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  // Método para establecer una imagen por defecto
  async fotoDefecto() {
    this.photo = '/assets/images/profile.jpg'; // Ruta de la imagen por defecto
    localStorage.setItem('imagenPerfil', this.photo);

    const user = localStorage.getItem('usuario');
    if (!user) {
      console.error('No hay sesión de usuario activa');
      return;
    }

    const exito = await this.authService.actualizarFotoPerfil(user, this.photo);

    if (!exito) {
      console.error('Error al guardar la imagen por defecto en la base de datos');
    }
  }


}
