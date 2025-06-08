import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';

@Component({
  selector: 'app-leidos',
  templateUrl: './leidos.page.html',
  styleUrls: ['./leidos.page.scss'],
  standalone: false
})
export class LeidosPage implements OnInit {
  estados: string[] = ['Leyendo', 'Leído', 'Por Leer', 'Abandonado'];
  mangas: any[] = [];

  constructor(private menuCtrl: MenuController,
              private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

  ionViewWillEnter() {
    this.menuCtrl.close("main-menu");

    const guardados = localStorage.getItem('mangas');
    if (guardados) {
      this.mangas = JSON.parse(guardados);
    }
  }

  get mangasFiltrados() {
    return this.mangas.filter(m => m.estadoSeleccionado === 'Leído');
  }

  cambiarEstado(manga: any, nuevoEstado: string) {
    manga.estadoSeleccionado = nuevoEstado;
    localStorage.setItem('mangas', JSON.stringify(this.mangas));
  }

  async abrirImagen(imagenUrl: string) {
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        imagen: imagenUrl
      },
      cssClass: 'fullscreen-modal'
    });
  
    await modal.present();
  }
}