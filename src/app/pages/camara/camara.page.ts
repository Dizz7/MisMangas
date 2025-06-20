import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
    private menuCtrl: MenuController) { }

  ngOnInit() {
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

    } catch (error) {
      console.error('Error al tomar foto', error);
    }
  }

}
